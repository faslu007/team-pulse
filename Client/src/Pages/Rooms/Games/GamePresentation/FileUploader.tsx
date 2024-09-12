import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// PLUGINS
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginGetFile from 'filepond-plugin-get-file';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    // FilePondPluginImagePreview, // Ensure this is not registered
    FilePondPluginGetFile,
    FilePondPluginFileRename,
);

// Firebase imports
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../../firebase-config';
import { useSnackbar } from '../../../../commons/Snackbar/Snackbar';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { RootState } from '../../../../Store';
import { privateApi } from '../../../../api';
import { updateInputFieldValues } from './GamePresentationSlice';
import { Skeleton } from '@mui/material';

const FileUploader: React.FC = () => {
    const dispatch = useAppDispatch();
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const activeRoomId = useAppSelector((state: RootState) => state.gamePresentationDraft.activeRoomId);
    const activeSlideId = useAppSelector((state: RootState) => state.gamePresentationDraft.activeSlideId);
    const preUploadedFiles = useAppSelector((state: RootState) => state.gamePresentationDraft.draftSlide);

    const acceptedFileTypes = [
        'image/jpeg',
        'image/png',
        'image/heif',
        'image/gif',
        'image/svg+xml',
        'image/*',
        'video/*',
        'audio/*'
    ];
    const maxFileSize = '100MB';


    const handleFileUpload = async (file: File) => {

        if (preUploadedFiles.mediaContentUri) {
            showSnackbar(true, "error", "Please delete the existing media content before uploading a new one.", 10000);
            return;
        }

        // Convert maxFileSize from string to bytes
        const maxFileSizeInBytes = 1000 * 1024 * 1024; // 1000MB in bytes

        // Check if the file type is allowed
        const isFileTypeValid = acceptedFileTypes.some((type) => {
            return type === file.type ||
                (type === 'image/*' && file.type.startsWith('image/')) ||
                (type === 'video/*' && file.type.startsWith('video/')) ||
                (type === 'audio/*' && file.type.startsWith('audio/'));
        });

        if (!isFileTypeValid) {
            showSnackbar(true, "error", "Only video, audio, and image files are allowed.", 10000);
            throw new Error('Invalid file type. Please upload a valid file.');
        }

        // Check if the file size is within the allowed limit
        if (file.size > maxFileSizeInBytes) {
            showSnackbar(true, "error", "File size exceeds 1000MB allowed.", 10000);
            throw new Error(`File size exceeds the maximum limit of ${maxFileSizeInBytes / (1024 * 1024)} MB. Please upload a smaller file.`);
        }

        try {
        // Rename the file for consistency
            const newFileName = await renameFile(file.name);

            // Reference to Firebase storage
            const storageRef = ref(storage, `uploads/roomId-${activeRoomId}/slideId-${activeSlideId}/${newFileName}`);

            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get the download URL from Firebase
            const fileURL = await getDownloadURL(storageRef);

            // Update the server with the file details
            await onFileUploadSuccessToFirebase({
                mediaContentType: file.type.split('/')[0], // Extract media type (e.g., 'image', 'video')
                mediaContentUri: fileURL,
                contentTypeExtension: file.name.split('.').pop() // Extract file extension
            });

            showSnackbar(true, "success", "File uploaded and saved successfully.", 5000);
        } catch (error) {
            showSnackbar(true, "error", `Error uploading file`, 10000);
            console.error('File upload error:', error);
        }
    };

    // Function to handle server communication after successful file upload
    const onFileUploadSuccessToFirebase = async (fileObject) => {
        try {
            const url = `games/${activeRoomId}/slide/${activeSlideId}/addMediaContent`;
            const response = await privateApi.put(url, fileObject);

            if (response.status === 200) {
                console.log('Server response:', response.data);
                dispatch(updateInputFieldValues({
                    field: 'mainState', stateToUpdate: 'draftSlide', value: {
                        ...preUploadedFiles,
                        mediaContentType: fileObject.mediaContentType,
                        mediaContentUri: fileObject.mediaContentUri,
                        contentTypeExtension: fileObject.contentTypeExtension
                    }
                }))
            } else {
                throw new Error('Failed to add media content to the slide.');
            }
        } catch (error) {
            showSnackbar(true, "error", `Error updating file into the server.`, 10000);
            console.error('Server update error:', error);
        }
    };


    const renameFile = async (fileName: string): Promise<string> => {
        const currentDate = new Date();
        const formattedDate = currentDate
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
            })
            .replace(/\/|\s|:|-/g, "")
            .replace(/,/g, "-");
        return `${formattedDate}-${fileName}`;
    };


    const handleFileDelete = async () => {
        setIsLoading(true);
        try {
            const firebaseFilePath = preUploadedFiles.mediaContentUri;

            // Create a reference to the file to delete
            const fileRef = ref(storage, firebaseFilePath);

            // Delete the file from Firebase Storage
            await deleteObject(fileRef);
            console.log('File deleted successfully from Firebase Storage.');

            // Proceed to delete the file reference from the server only if Firebase deletion is successful
            const url = `games/${activeRoomId}/slide/${activeSlideId}/deleteMediaContent`;
            const response = await privateApi.put(url);
            console.log('File reference deleted from server:', response);

            showSnackbar(true, "success", "File deleted successfully.", 5000);

            dispatch(updateInputFieldValues({
                field: 'mainState', stateToUpdate: 'draftSlide', value: {
                    ...preUploadedFiles,
                    mediaContentType: null,
                    mediaContentUri: null,
                    contentTypeExtension: null
                }
            }))
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle image load
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    // Function to handle image error
    const handleImageError = (e) => {
        e.currentTarget.src = 'https://via.placeholder.com/150?text=Image+not+found';
        setIsLoading(false);
    };

    // Function to handle image load start
    const handleImageLoadStart = () => {
        setIsLoading(true);
    };


    return (
        <div style={{ paddingBottom: '8px' }}>
            <div style={{ position: 'sticky', top: 0, zIndex: '2' }}>
                <FilePond
                    files={[]}
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: (
                            fieldName,
                            file,
                            metadata,
                            load,
                            error: (errorText: string) => void,
                            progress: (computed: number, current: number, total: number) => void,
                            abort: () => void
                        ) => {
                            handleFileUpload(file)
                                .then(() => load(file.filename))
                                .catch((err) => error(err.message));
                        },
                    }}
                    name="files"
                    checkValidity={true}
                    credits={false}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    acceptedFileTypes={acceptedFileTypes}
                    allowFileTypeValidation={true}
                    maxFileSize={maxFileSize}
                    fileRenameFunction={(file) =>
                        new Promise((resolve) => {
                            const currentDate = new Date();
                            const formattedDate = currentDate
                                .toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    timeZoneName: "short",
                                })
                                .replace(/\/|\s|:|-/g, "")
                                .replace(/,/g, "-");
                            const newFileName = formattedDate + "-" + file.name;
                            resolve(newFileName);
                        })
                    }
                    maxParallelUploads={1}
                    disabled={false}
                    allowFileMetadata={true}
                    fileMetadataObject={{ capture: 'environment' }}
                />
            </div>

            <div style={{ textAlign: 'center', padding: '20px', overflow: 'scroll' }}>
                {preUploadedFiles && [preUploadedFiles].map((file, index) => (
                    <div
                        key={file._id || index}
                        style={{
                            position: 'relative',
                            marginBottom: '20px',
                            display: 'inline-block'
                        }}
                    >
                        {file.mediaContentUri &&
                            <IconButton
                                onClick={() => handleFileDelete()}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    zIndex: 1
                                }}
                                aria-label="delete"
                                disabled={isLoading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }

                        {file.mediaContentType === 'image' && (
                            <>
                                {isLoading && (
                                    <Skeleton
                                        variant="rectangular"
                                        width={960}
                                        height={400}
                                        style={{ borderRadius: '8px' }}
                                    />
                                )}
                                <img
                                    src={file.mediaContentUri}
                                    alt={`Uploaded ${file.mediaContentType}`}
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                        display: isLoading ? 'none' : 'block',
                                    }}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    onLoadStart={handleImageLoadStart}
                                />
                            </>
                        )}

                        {file.mediaContentType === 'audio' && (
                            <audio
                                controls
                                src={file.mediaContentUri}
                                style={{ borderRadius: '8px', marginRight: '50px' }}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        )}

                        {(file.mediaContentType === 'video') && (
                            <video
                                width="960"
                                height="400"
                                controls
                                src={file.mediaContentUri}
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUploader;

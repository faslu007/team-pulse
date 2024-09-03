import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

// PLUGINS
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginGetFile from 'filepond-plugin-get-file';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-get-file/dist/filepond-plugin-get-file.min.css';

import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';

// Firebase imports
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../../../firebase-config';

// Register the plugins
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginGetFile,
    FilePondPluginFileRename,
);

const FileUploader: React.FC = () => {
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
    const maxFileSize = '1000MB';

    const handleFileUpload = async (file: File) => {
        const newFileName = await renameFile(file.name);
        const storageRef = ref(storage, `uploads/${newFileName}`);
        await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(storageRef);
        console.log(fileURL);

        // Call the callback with the uploaded file URL
        // onFileUploadSuccess({ url: fileURL, name: newFileName });
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

    return (
        <div style={{ paddingBottom: '8px' }}>
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

            <div style={{ textAlign: 'center', padding: '20px' }}>
                <video
                    width="960"
                    height="400"
                    controls
                    src={"https://firebasestorage.googleapis.com/v0/b/team-pulse-dev.appspot.com/o/uploads%2F09032024-030933PMGMT%2B530-09032024-030931PMGMT%2B530-sample_960x400_ocean_with_audio.mp4?alt=media&token=25c96636-cb3d-4bd5-901e-b80f4fdc6248"}
                    style={{ maxWidth: '100%', height: 'auto' }}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}

export default FileUploader;

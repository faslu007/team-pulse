import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import MonospaceIcon from '@mui/icons-material/Code';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MoodIcon from '@mui/icons-material/Mood';
import ImageIcon from '@mui/icons-material/Image';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';

export const richTextEditorToolbar = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'history'],
    inline: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
        bold: { icon: FormatBoldIcon, className: undefined },
        italic: { icon: FormatItalicIcon, className: undefined },
        underline: { icon: FormatUnderlinedIcon, className: undefined },
        strikethrough: { icon: StrikethroughSIcon, className: undefined },
        monospace: { icon: MonospaceIcon, className: undefined },
        superscript: { icon: SuperscriptIcon, className: undefined },
        subscript: { icon: SubscriptIcon, className: undefined },
    },
    blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontSize: {
        icon: FormatSizeIcon,
        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontFamily: {
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    // list: {
    //     inDropdown: false,
    //     className: undefined,
    //     component: undefined,
    //     dropdownClassName: undefined,
    //     options: ['unordered', 'ordered', 'indent', 'outdent'],
    //     unordered: { icon: unordered, className: undefined },
    //     ordered: { icon: ordered, className: undefined },
    //     indent: { icon: indent, className: undefined },
    //     outdent: { icon: outdent, className: undefined },
    // },
    textAlign: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['left', 'center', 'right', 'justify'],
        left: { icon: AlignHorizontalLeftIcon, className: undefined },
        center: { icon: FormatAlignCenterIcon, className: undefined },
        right: { icon: FormatAlignRightIcon, className: undefined },
        justify: { icon: FormatAlignJustifyIcon, className: undefined },
    },
    colorPicker: {
        icon: ColorLensIcon,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        dropdownClassName: undefined,
        showOpenOptionOnHover: true,
        defaultTargetOption: '_self',
        options: ['link', 'unlink'],
        link: { icon: LinkIcon, className: undefined },
        unlink: { icon: LinkOffIcon, className: undefined },
        linkCallback: undefined
    },
    emoji: {
        icon: MoodIcon,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        emojis: [
            '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
            '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
            '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
            '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
            '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
            '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
            '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
            '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
            '✅', '❎', '💯',
        ],
    },
    // embedded: {
    //     icon: embedded,
    //     className: undefined,
    //     component: undefined,
    //     popupClassName: undefined,
    //     embedCallback: undefined,
    //     defaultSize: {
    //         height: 'auto',
    //         width: 'auto',
    //     },
    // },
    image: {
        icon: ImageIcon,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        uploadCallback: undefined,
        previewImage: false,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        alt: { present: false, mandatory: false },
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    // remove: { icon: eraser, className: undefined, component: undefined },
    history: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['undo', 'redo'],
        undo: { icon: UndoIcon, className: undefined },
        redo: { icon: RedoIcon, className: undefined },
    },
};

/**
 * English Messages
 *
 * Centralized management of all user-facing text
 * Structure mirrors ko.ts for consistency
 */

export const MESSAGES_EN = {
    // =========================================================
    // Common
    // =========================================================
    common: {
        loading: 'Loading...',
        processing: 'Processing...',
        error: 'An error occurred.',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        delete: 'Delete',
        reset: 'Reset',
    },

    // =========================================================
    // FilePanel
    // =========================================================
    filePanel: {
        // UrlInput
        urlHeader: 'Load from URL',
        loadButton: 'Load',

        // SampleList
        availableSamples: 'Available Samples',

        // FileUploadBox
        dragPrompt: 'Drag a file or click to select',
    },

    // =========================================================
    // Errors
    // =========================================================
    errors: {
        // File related
        emptyFile: 'File is empty.',
        invalidType: (extensions: string) =>
            `Allowed file types: ${extensions}`,
        fileTooLarge: (maxSize: string) =>
            `File is too large. Maximum size is ${maxSize}.`,

        // URL related
        emptyUrl: 'Please enter a URL.',
        invalidUrl: 'Invalid URL format.',
        invalidProtocol: 'URL must start with https:// or http://.',
        invalidExtension: (extensions: string) =>
            `Allowed file types: ${extensions}`,

        // Viewer related
        viewerError: 'Viewer error occurred.',
        loadFailed: 'Failed to load file.',
    },

    // =========================================================
    // Viewer
    // =========================================================
    viewer: {
        errorTitle: (viewerName: string) => `${viewerName} Error`,
        errorDescription: 'An unexpected error occurred.',
        reloadButton: 'Reload',
    },

    // =========================================================
    // Layout
    // =========================================================
    layout: {
        menu: 'Menu',
        home: 'Home',
        cadViewer: 'CAD Viewer',
        workerViewer: 'Worker Viewer',
    },

    // =========================================================
    // CadViewer
    // =========================================================
    cadViewer: {
        errors: {
            invalidType: 'Only DXF files are allowed (.dxf)',
            fileTooLarge: (maxMB: number) =>
                `File is too large. Maximum ${maxMB}MB allowed.`,
            parseError: 'Error occurred while parsing DXF file.',
            emptyFile: 'File is empty or has no valid entities.',
        },
        upload: {
            dragPrompt: 'Drag DXF file or click to select',
            maxSizeText: (maxMB: number) => `Max ${maxMB}MB`,
            loadingText: 'Parsing...',
        },
    },

    // =========================================================
    // WorkerViewer
    // =========================================================
    workerViewer: {
        errors: {
            fetchError: 'Failed to fetch model file.',
            parseError: 'Failed to parse glTF/glb file.',
            notFound: 'Model not found.',
            networkError: 'Network error occurred.',
        },
        upload: {
            dragPrompt: 'Drag GLB/GLTF file or click to select',
            maxSizeText: 'Max 50MB',
            loadingText: 'Loading model...',
        },
    },

    // =========================================================
    // Error
    // =========================================================
    error: {
        code404: '404',
        codeGeneric: 'Error',
        title404: 'Page Not Found',
        titleGeneric: 'Something Went Wrong',
        description404:
            'The page you requested does not exist or may have been moved.',
        descriptionGeneric:
            'An unexpected error occurred. Please try again later.',
        backToHome: 'Back to Home',
    },

    // =========================================================
    // Home
    // =========================================================
    home: {
        title: 'Three.js 3D Viewer',
        subtitle: '3D Graphics Demo Project',
        footer: '3D Viewer Project based on React Three Fiber',
        refreshColorsLabel: 'Refresh colors',
    },
} as const;

/**
 * Type for English messages
 */
export type MessagesEN = typeof MESSAGES_EN;

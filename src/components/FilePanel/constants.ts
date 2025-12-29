/**
 * FilePanel - Constants
 */

/** SampleList 스타일 */
export const SAMPLE_LIST_STYLES = {
    container: 'rounded-lg bg-gray-900/90 p-3 backdrop-blur-sm',
    header: 'mb-2 flex items-center gap-2',
    headerIcon: 'h-4 w-4',
    headerText: 'text-xs text-gray-400',
    list: 'max-h-[200px] space-y-1 overflow-y-auto',
    item: 'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-gray-200 transition-colors hover:bg-gray-700 disabled:opacity-50',
    itemIcon: 'h-4 w-4',
    itemName: 'flex-1 truncate',
    itemFormat: 'text-xs text-gray-500',
    loading: 'flex items-center justify-center py-4',
    loadingIcon: 'h-5 w-5 animate-spin',
} as const;

/** UrlInput 스타일 */
export const URL_INPUT_STYLES = {
    container: 'rounded-lg bg-gray-900/90 p-3 backdrop-blur-sm',
    header: 'mb-2 flex items-center gap-2',
    headerIcon: 'h-4 w-4',
    headerText: 'text-xs text-gray-400',
    inputWrapper: 'flex gap-2',
    input: 'flex-1 rounded bg-gray-700 px-2 py-1.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50',
    button: 'rounded px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50',
} as const;

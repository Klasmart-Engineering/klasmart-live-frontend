export const DATA_STALE_TIME = 60 * 1000; // 60 seconds
export const SCHEDULE_FETCH_INTERVAL_MINUTES = 5;
export const SCHEDULE_PAGE_START = 1;
export const SCHEDULE_PAGE_ITEM_HEIGHT_MIN = 66;
export const SCHEDULE_PAGINATION_DELAY = 1000;
export const SCHEDULE_HOME_FUN_STUDY_DISPLAY_COUNT_MAX = 99;
export const SCHEDULE_FETCH_MONTH_DIFF = 2;
export const REQUEST_RETRY_COUNT_MAX = 1;
export const URL_REGEX = /(ftp|https?):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
export const AUDIO_GLOBALLY_MUTED_DEFAULT = true;
export const VIDEO_GLOBALLY_MUTED_DEFAULT = true;
export const THEME_COLOR_PRIMARY_DEFAULT = `#3676ce`;

export const schedulePageWindowItemHeightToPageSize = (windowHeight: number, itemHeight: number) => Math.floor((windowHeight * 1.5) / itemHeight);

// cn.ts
const messages: Record<string, string> = {
    join_CameraPreviewFallback_allowMediaPermissions: "Allow media device permissions",
    join_PermissionAlertDialog_DialogTitle: "Allow to use your media device for Kidsloop Live",
    join_PermissionAlertDialog_DialogContentText_live: "Kidsloop Live needs access to the camera and microphone in order for other class participants to see you and hear you.",
    join_PermissionAlertDialog_DialogContentText_classes_study: "Kidsloop Live needs access to the microphone for in-class interactive contents.",
    join_PermissionAlertDialog_Button_close: "Close",
    
    err_button_home: "Home",
    err_button_signin: "Back to Sign In",
    err_button_confirm: "Comfirm",
    err_400_title: "Bad Request",
    err_400_subtitle: "The server could not understand the request due to invalid syntax",
    err_401_title: "Unauthorized",
    err_401_subtitle: "Please check if you are signed in",
    err_403_title: "Forbidden",
    err_403_title_not_supported: "Not Supported",
    err_403_subtitle: "You don't have permission to access",
    err_403_subtitle_not_supported: "You have to belong to at least 1 organization",
    err_403_description_not_supported: "The Organization can be invited by your teacher. Also, teacher is not allowed to use Student App. Please use the web browser to start a live as a teacher account.",
    err_404_title: "Not Found",
    err_404_subtitle: "The requested URL was not found",
    err_500_title: "Internal Server Error",
    err_500_subtitle: "Oops! Something went wrong",

    activity_link: "活动链接",

    join_live: "Joining Live...",
    join_cameraPreviewFallback_allowMediaPermissions: "允许媒体设备权限",
    join_permissionAlertDialog_title: "允许Kidsloop 直播访问你的媒体设备",
    join_permissionAlertDialog_contentText_live: "Kidsloop Live需要接入摄像头和麦克风，以便其他参与者能够看到你并听到你的声音",
    join_permissionAlertDialog_contentText_classesStudy: "Kidsloop直播需要接入麦克风，进行课内互动内容",
    join_permissionAlertDialog_action_close: "关闭",

    camera_participantInfo_chalkboardIcon_tooltip: "老师是 {}",
    camera_participantInfo_crownIcon_tooltip: "老师 {} 正在演示",
    camera_fullScreenCameraButton_tooltip: "摄像头全屏",
    camera_moreControlsButton_listSubheader_whiteboard: "给予白板控制权",
    camera_moreControlsButton_listSubheader_trophy: "赠送奖杯",
    camera_moreControlsButton_listSubheader_toggleCamMic: "切换摄像头/麦克风",

    whiteboard_permissionControls_listItemText_disallow: "禁止绘画",
    whiteboard_permissionControls_listItemText_allow: "允许绘画",
    whiteboard_permissionControls_listItemText_clear: "清除",

    allow_media_permission: "如果您想要使用媒体设备，请授权允许使用你的话筒和相机",
    button_cancel: "Cancel",
    button_confirm: "Confirm",
    error_camera_unavailable: "📷摄像头无法访问",
    error_empty_name: "请输入你的名字",
    error_invaild_token: "没有权限无法上课",
    error_webrtc_unavailable: "错误：WebRTC 上下文不可用",
    error_unknown_content: "错误：未知内容类型",
    error_unknown_error: "对不起！发生了一些错误",
    error_unknown_user: "未知用户",
    failed_to_connect: "连接失败",
    hello: "你好，{name}！",
    waiting_for_class: "等待课程开始",
    what_is_your_name: "你叫什么名字",
    loading: "载入中",
    loading_text: "正在准备请稍等！",
    student_stream_mode: "老师目前正在上课",
    student_activity_mode: "请遵照老师的指示",
    join_room: "进入教室",
    no_device_available: "没有可用的设备",
    no_messages: "目前没有信息...",
    no_participants: "目前还没有人进入班级...",
    select_device: "选择{device}",
    connect_camera: "访问你的摄像头📷",

    refresh_activity: "刷新活动",
    what_is_this: "这是什么？",
    live_buttonStop: "停止",
    live_buttonPresent: "课程演示",
    live_buttonObserve: "学生模式",
    live_buttonScreen: "共享屏幕",
    live_buttonStopFull: "摄像头模式",
    live_buttonPresentFull: "演示模式",
    live_buttonObserveFull: "观察模式",
    live_buttonScreenFull: "共享屏幕",
    title_participants: "参加人员",
    title_lesson_plan: "教学计划",
    title_chat: "聊天",
    title_whiteboard: "白板",
    title_settings: "设置",
    title_end_class: "End Class",
    end_class_title: "End the class?",
    invite_students: "邀请",
    copy_clipboard: "复制到剪贴板",
    quick_toggles: "快速操作",
    set_cameras_off: "设置摄像头关闭",
    set_cameras_on: "设置摄像头打开",
    mute_all: "全部静音",
    unmute_all: "解除静音",
    hide_whiteboard: "隐藏白板",
    show_whiteboard: "显示白板",
    clear_whiteboard: "清除白板",
    give_star: "奖励所有人星星",
    give_trophy: "奖励所有人奖杯",
    give_heart: "奖励所有人爱心",
    encourage: "给所有人鼓励",
    share_something_here: "上传你想分享的内容",
    enable_dark_mode: "使用深色模式",
    language: "语言",
    two_columns: "2列",
    three_columns: "3列",
    four_columns: "4列",
    six_columns: "6列",
    cols_camera_per_row: "一行中显示的摄像头数量",
    cols_observe_per_row: "一行中显示的学生屏幕数量",

    whiteboard_color: "颜色",
    whiteboard_clear: "清除",
    whiteboard_hide: "隐藏",
    whiteboard_show: "展示",

    turn_off_camera: "关闭摄像头",
    turn_on_camera: "打开摄像头",
    turn_off_mic: "关闭麦克风",
    turn_on_mic: "打开麦克风",

    browser_guide_title: "KidsLoop Live仅支持Chrome浏览器",
    browser_guide_title_macos: "KidsLoop Live在Mac OS系统中支持Safari 和Chrome 浏览器",
    browser_guide_title_ios: "KidsLoop Live在iOS系统中仅支持Safari浏览器",
    browser_guide_body: "请下载支持的浏览器并重试",

    account_selectOrg_privacyPolicy: "Privacy Policy",
    account_selectOrg_signOut: "Sign Out",
    account_selectOrg_whichOrg: "Which Organization?",

    schedule_liveTab: "Live",
    schedule_studyTab: "Study",
    schedule_loadingSelectOrg: "Please select an organization first by tapping the top-left corner!",
    schedule_errorFetchTimeViews: "Oops, Failed to load schedules. Retry by tapping refresh button on the top-right corner!",
    schedule_liveSubheaderToday: "TODAY",
    schedule_liveSubheaderTomorrow: "TOMORROW",
    schedule_liveSubheaderUpcoming: "SCHEDULED LIVES",
    schedule_liveNoSchedule: "Nothing scheduled Live",
    schedule_studyAnytimeStudy: "Anytime Study",
    schedule_studyNoSchedule: "Nothing scheduled Study",
    schedule_selectOrgLoaded: "",

    loading_mediaPermission: "Camera and Microphone premissions required. Please grant the permissions and restart application.",

    title_settings_live: "Room Settings",
    layout_tabinnercontent_leaveroom: "Leave Room",

    auth_waiting_for_authentication: "Waiting for authentication...",

    cordova_loading: "Loading...",
    cordova_permissions_error: "Camera and Microphone premissions required. Please grant the permissions and restart application."
};
export default messages;
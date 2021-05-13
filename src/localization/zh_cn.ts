// cn.ts
const messages: Record<string, string> = {
    activity_link: `活动链接`,

    join_cameraPreviewFallback_allowMediaPermissions: `允许媒体设备权限`,
    join_permissionAlertDialog_title: `允许Kidsloop 直播访问你的媒体设备`,
    join_permissionAlertDialog_contentText_live: `Kidsloop Live需要接入摄像头和麦克风，以便其他参与者能够看到你并听到你的声音`,
    join_permissionAlertDialog_contentText_classesStudy: `Kidsloop直播需要接入麦克风，进行课内互动内容`,
    join_permissionAlertDialog_action_close: `关闭`,

    camera_participantInfo_chalkboardIcon_tooltip: `老师是 {}`,
    camera_participantInfo_crownIcon_tooltip: `老师 {} 正在演示`,
    camera_fullScreenCameraButton_tooltip: `摄像头全屏`,
    camera_moreControlsButton_listSubheader_whiteboard: `给予白板控制权`,
    camera_moreControlsButton_listSubheader_trophy: `赠送奖杯`,
    camera_moreControlsButton_listSubheader_toggleCamMic: `切换摄像头/麦克风`,

    whiteboard_permissionControls_listItemText_disallow: `禁止绘画`,
    whiteboard_permissionControls_listItemText_allow: `允许绘画`,
    whiteboard_permissionControls_listItemText_clear: `清除`,

    allow_media_permission: `如果您想要使用媒体设备，请授权允许使用你的话筒和相机`,
    error_camera_unavailable: `📷摄像头无法访问`,
    error_empty_name: `请输入你的名字`,
    error_invaild_token: `没有权限无法上课`,
    error_webrtc_unavailable: `错误：WebRTC 上下文不可用`,
    error_unknown_content: `错误：未知内容类型`,
    error_unknown_error: `对不起！发生了一些错误`,
    error_unknown_user: `未知用户`,
    failed_to_connect: `连接失败`,
    hello: `你好，{name}！`,
    waiting_for_class: `等待课程开始`,
    what_is_your_name: `你叫什么名字`,
    loading: `载入中`,
    loading_text: `正在准备请稍等！`,
    student_stream_mode: `老师目前正在上课`,
    student_activity_mode: `请遵照老师的指示`,
    join_room: `进入教室`,
    no_device_available: `没有可用的设备`,
    no_messages: `目前没有信息...`,
    no_participants: `目前还没有人进入班级...`,
    select_device: `选择{device}`,
    connect_camera: `访问你的摄像头📷`,

    refresh_activity: `刷新活动`,
    what_is_this: `这是什么？`,
    live_buttonStop: `停止`,
    live_buttonPresent: `课程演示`,
    live_buttonObserve: `学生模式`,
    live_buttonScreen: `共享屏幕`,
    live_buttonStopFull: `摄像头模式`,
    live_buttonPresentFull: `演示模式`,
    live_buttonObserveFull: `观察模式`,
    live_buttonScreenFull: `共享屏幕`,
    title_participants: `参加人员`,
    title_lesson_plan: `教学计划`,
    title_chat: `聊天`,
    title_whiteboard: `白板`,
    title_settings: `设置`,
    invite_students: `邀请`,
    copy_clipboard: `复制到剪贴板`,
    quick_toggles: `快速操作`,
    set_cameras_off: `设置摄像头关闭`,
    set_cameras_on: `设置摄像头打开`,
    mute_all: `全部静音`,
    unmute_all: `解除静音`,
    hide_whiteboard: `隐藏白板`,
    show_whiteboard: `显示白板`,
    clear_whiteboard: `清除白板`,
    give_star: `奖励所有人星星`,
    give_trophy: `奖励所有人奖杯`,
    give_heart: `奖励所有人爱心`,
    encourage: `给所有人鼓励`,
    share_something_here: `上传你想分享的内容`,
    enable_dark_mode: `使用深色模式`,
    language: `语言`,
    two_columns: `2列`,
    three_columns: `3列`,
    four_columns: `4列`,
    six_columns: `6列`,
    cols_camera_per_row: `一行中显示的摄像头数量`,
    cols_observe_per_row: `一行中显示的学生屏幕数量`,

    whiteboard_color: `颜色`,
    whiteboard_clear: `清除`,
    whiteboard_hide: `隐藏`,
    whiteboard_show: `展示`,

    turn_off_camera: `关闭摄像头`,
    turn_on_camera: `打开摄像头`,
    turn_off_mic: `关闭麦克风`,
    turn_on_mic: `打开麦克风`,

    browser_guide_title: `KidsLoop Live仅支持Chrome浏览器`,
    browser_guide_title_macos: `KidsLoop Live在Mac OS系统中支持Safari 和Chrome 浏览器`,
    browser_guide_title_ios: `KidsLoop Live在iOS系统中仅支持Safari浏览器`,
    browser_guide_body: `请下载支持的浏览器并重试`,

    toolbar_class_details: `Class Details`,
    toolbar_canvas: `Canvas`,
    toolbar_global_actions: `Global Actions`,
    toolbar_global_actions_turn_on_screenshare: `Turn on screenshare`,
    toolbar_global_actions_turn_of_screenshare: `Turn off screenshare`,
    toolbar_lesson_plan: `Lesson Plan`,
    toolbar_view_modes: `View Modes`,
    toolbar_view_modes_disabled_screenshare: `View modes are not available when screenshare is active`,
    toolbar_chat: `Chat`,
    toolbar_endcall_ask_to_leave: `Ask permission to leave the class`,
    toolbar_microphonelocked: `The teacher has disabled your microphone`,
    toolbar_camera_locked: `The teacher has disabled your camera`,
    classdetails_details: `Class Details`,
    classdetails_class_name: `Class Name`,
    classdetails_lesson_name: `Lesson Name`,
    classdetails_room_id: `Room ID`,
    classdetails_class_type: `Class Type`,
    classdetails_enrolled_participants: `Enrolled Participants`,
    classdetails_program: `Program`,
    classdetails_subject: `Subject`,
    classdetails_lesson_materials: `Lesson Materials`,
    classdetails_start_time: `Start Time`,
    classdetails_end_time: `End Time`,
    classdetails_roster: `Class Roster`,
    classdetails_roster_teachers: `Teachers`,
    classdetails_roster_students: `Students`,
    classdetails_roster_absents: `Absents`,
    viewmodes_on_stage: `On Stage`,
    viewmodes_observe: `Observe`,
    viewmodes_present: `Present`,
    chat_messages: `Messages`,
    chat_messages_write_placeholder: `Write your message`,
    chat_messages_noresults: `No messages`,
    chat_attachments: `Attachments`,
    chat_attachments_download_label: `Download Attachment`,
    chat_attachments_upload: `Upload`,
    chat_attachments_noresults: `No Attachments`,
    lessonplan_content: `Content`,
    lessonplan_content_noresults: `No lesson material`,
    lessonplan_manuals: `Teacher Manuals`,
    lessonplan_manuals_noresults: `No teacher manuals`,
    settings_menu_settings: `Settings`,
    settings_menu_schedule: `Schedule`,
    settings_menu_toolbar: `Toolbar`,
    settings_menu_record: `Record`,
    settings_language_title: `Language`,
    settings_language_select_language: `Select your language`,
    end_class: `End Class`,
    end_class_confirm: `Are you sure to end the class?`,
    end_class_description: `Ending class will close all user sessions`,
    leave_class: `Leave Class`,
    leave_class_description: `Leaving class will end the class session, close your camera and turn off your microphone`,
    feedback_terrible: `Terrible`,
    feedback_bad: `Bad`,
    feedback_okay: `Okay`,
    feedback_good: `Good`,
    feedback_great: `Great`,
    class_ended_title: `Class has ended`,
    class_ended_thanks_for_attending: `Thanks for attending the class`,
    class_ended_you_have_left: `You have left the class`,
    class_ended_return_to_hub: `Return to hub`,
    parents_captcha_title: `Parents only`,
    parents_captcha_description: `To continue, please tap the numbers in ascending order`,
    parents_captcha_error: `Error, please try again`,
    notification_user_sent_message: `New message from: {user}`,
    notification_user_is_pinned: `{user} has been pinned`,
    notification_you_have_controls: `You have teacher controls`,
    notification_you_dont_have_controls: `You dont' have teacher controls`,
    notification_user_left: `{user} has left the class rooom`,
    notification_user_muted_microphone: `{user} has toggled off their microphone`,
    notification_user_muted_camera: `{user} has toggled off their camera`,
    notification_self_muted_user_microphone: `You have toggled off {user}'s microphone`,
    notification_self_muted_user_camera: `You have toggled off {user}'s camera`,
    notification_self_muted_user_canvas: `You have toggled off {user}'s canvas`,
    notification_self_muted_by_user_microphone: `{user} has toggled off your microphone`,
    notification_self_muted_by_user_camera: `{user} has toggled off your camera`,
    notification_self_muted_by_user_canvas: `{user} has toggled off your canvas`,
    notification_global_mute_microphone: `All student microphones have been toggled off`,
    notification_global_mute_camera: `All student cameras have been toggled off`,
    notification_global_mute_canvas: `All student canvas have been toggled off`,
    notification_global_unmute_microphone: `You can toggle on your microphone`,
    notification_global_unmute_camera: `You can toggle on your camera`,
    notification_new_attachment: `New attachment available`,
    notification_observe_content_interactive: `Content is now interactive`,
    toggle_camera_off: `Toggle camera off`,
    toggle_camera_on: `Toggle camera on`,
    toggle_all_cameras_off: `Toggle all cameras off`,
    toggle_all_cameras_on: `Toggle all cameras on`,
    toggle_microphone_on: `Toggle microphone on`,
    toggle_microphone_off: `Toggle microphone off`,
    toggle_all_microphones_off: `Toggle all microphones off`,
    toggle_all_microphones_on: `Toggle all microphones on`,
    toggle_all_canvas_off: `Toggle all canvas off`,
    toggle_all_canvas_on: `Toggle all canvas on`,
    toggle_room_controls: `Give room controls`,
    common_feature_not_available: `This feature is not available yet`,
    common_close_tab: `Close this tab`,
    common_cancel: `Cancel`,
    common_dismiss: `Dismiss`,
    common_submit: `Submit`,
    title_mosaic: `Mosaic (Press 'esc' to exit)`,
    you: `You`,

    classtype_live: `Online`,
    class_ended_how_was_the_class: `How was the class?`,
    whiteboard_eraser: `Eraser`,
    whiteboard_clear_canvas: `Clear canvas`,
    whiteboard_clear_all_canvas: `Clear all canvas`,
};
export default messages;

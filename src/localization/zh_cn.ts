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

    toolbar_class_details: `课堂详情`,
    toolbar_canvas: `白板`,
    toolbar_global_actions: `全局控制`,
    toolbar_global_actions_turn_on_screenshare: `共享屏幕`,
    toolbar_global_actions_turn_of_screenshare: `停止屏幕共享`,
    toolbar_lesson_plan: `教学课件`,
    toolbar_view_modes: `查看模式`,
    toolbar_view_modes_disabled_screenshare: `共享屏幕时，查看模式选项不可用`,
    toolbar_chat: `聊天`,
    toolbar_endcall_ask_to_leave: `请求允许离开教室`,
    toolbar_microphonelocked: `老师已禁用你的麦克风`,
    toolbar_camera_locked: `老师已禁用你的摄像头`,
    classdetails_details: `课程详情`,
    classdetails_class_name: `课堂名称`,
    classdetails_lesson_name: `课件名称`,
    classdetails_room_id: `房间号`,
    classdetails_class_type: `课程类型`,
    classdetails_enrolled_participants: `参与者`,
    classdetails_program: `学科`,
    classdetails_subject: `课程`,
    classdetails_lesson_materials: `课件素材`,
    classdetails_start_time: `开始时间`,
    classdetails_end_time: `结束时间`,
    classdetails_roster: `班级花名册`,
    classdetails_roster_teachers: `老师`,
    classdetails_roster_students: `学生`,
    classdetails_roster_absents: `缺席学生`,
    viewmodes_on_stage: `上台`,
    viewmodes_observe: `观察`,
    viewmodes_present: `演示`,
    chat_messages: `留言`,
    chat_messages_write_placeholder: `写下你的留言`,
    chat_messages_noresults: `没有留言`,
    chat_attachments: `附件`,
    chat_attachments_download_label: `下载附件`,
    chat_attachments_upload: `上传`,
    chat_attachments_noresults: `没有附件`,
    lessonplan_content: `内容`,
    lessonplan_content_noresults: `没有教学素材`,
    lessonplan_manuals: `教师手册`,
    lessonplan_manuals_noresults: `没有教师手册`,
    settings_menu_settings: `设置`,
    settings_menu_schedule: `课表`,
    settings_menu_toolbar: `工具栏`,
    settings_menu_record: `记录`,
    settings_language_title: `语言`,
    settings_language_select_language: `选择语言`,
    end_class: `结束课程`,
    end_class_confirm: `是否确定结束课程`,
    end_class_description: `结束课程将关闭所有用户的学习`,
    leave_class: `离开课程`,
    leave_class_description: `离开课堂将关闭你的相机和麦克风，并结束课堂环节。`,
    feedback_not_so_good: `糟糕`,
    feedback_bad: `不太好`,
    feedback_okay: `一般`,
    feedback_good: `很好`,
    feedback_awesome: `优秀`,
    class_ended_title: `课程已结束`,
    class_ended_thanks_for_attending: `谢谢参与`,
    class_ended_you_have_left: `你已离开课程`,
    class_ended_return_to_hub: `返回首页`,
    parents_captcha_title: `仅限家长`,
    parents_captcha_description: `若要继续，请按升序选择数字`,
    parents_captcha_error: `错了，请重试`,
    notification_user_sent_message: `来自 {} 的新留言`,
    notification_user_is_pinned: `{} 已被留意`,
    notification_you_have_controls: `你有老师的控制权`,
    notification_you_dont_have_controls: `你没有老师控制权`,
    notification_user_left: `{} 已离开课程`,
    notification_user_muted_microphone: `{} 已关闭麦克风`,
    notification_user_muted_camera: `{} 已关闭摄像头`,
    notification_self_muted_user_microphone: `你已关闭 {} 的麦克风`,
    notification_self_muted_user_camera: `你已关闭 {} 的摄像头`,
    notification_self_muted_user_canvas: `你已关闭 {} 的白板`,
    notification_self_muted_by_user_microphone: `{} 已关闭你的麦克风`,
    notification_self_muted_by_user_camera: `{} 已关闭你的摄像头`,
    notification_self_muted_by_user_canvas: `{} 已关闭你白板`,
    notification_global_mute_microphone: `所有学生的麦克风已关闭`,
    notification_global_mute_camera: `所有学生的摄像头已关闭`,
    notification_global_mute_canvas: `所有学生的白板已关闭`,
    notification_global_unmute_microphone: `你可以打开你的麦克风`,
    notification_global_unmute_camera: `你可以打开你的摄像头`,
    notification_new_attachment: `有新的附件`,
    notification_observe_content_interactive: `内容现在可以互动`,
    toggle_camera_off: `关闭摄像头`,
    toggle_camera_on: `打开摄像头`,
    toggle_all_cameras_off: `关闭全部摄像头`,
    toggle_all_cameras_on: `打开全部摄像头`,
    toggle_microphone_on: `打开麦克风`,
    toggle_microphone_off: `关闭麦克风`,
    toggle_all_microphones_off: `打开全部麦克风`,
    toggle_all_microphones_on: `关闭全部麦克风`,
    toggle_all_canvas_off: `开启全部白板`,
    toggle_all_canvas_on: `关闭全部白板`,
    toggle_room_controls: `给予直播间控制权`,
    common_feature_not_available: `此功能尚不可用`,
    common_close_tab: `关闭选项卡`,
    common_cancel: `取消`,
    common_dismiss: `忽略`,
    common_submit: `提交`,
    title_mosaic: `马赛克模式（点击‘ESC’退出）`,
    you: `你`,

    classtype_live: `在线`,
    class_ended_how_was_the_class: `课上的怎么样？`,
    whiteboard_eraser: `橡皮擦`,
    whiteboard_clear_canvas: `清除白板`,
    whiteboard_clear_all_canvas: `清除全部白板`,

    no_teachers_connected: `没有老师在线`,
    no_students_connected: `没有学生在线`,

    feedback_detail_question: `Do you want to add more details?`,
    feedback_comment: `Leave a comment`,

    feedback_end_class_student_video_1: `Terrible video`,
    feedback_end_class_student_audio_1: `Terrible audio`,
    feedback_end_class_student_presentation_1: `Couldn't see teacher's screen`,
    feedback_end_class_student_other_1: `Other`,
    feedback_end_class_student_video_2: `Bad video`,
    feedback_end_class_student_audio_2: `Bad audio`,
    feedback_end_class_student_presentation_2: `Problem with teacher's screen`,
    feedback_end_class_student_other_2: `Other`,
    feedback_end_class_student_video_3: `Video was okay`,
    feedback_end_class_student_audio_3: `Audio was okay`,
    feedback_end_class_student_presentation_3: `Problem with teacher's screen`,
    feedback_end_class_student_other_3: `Other`,
    feedback_end_class_student_video_4: `Video working fine`,
    feedback_end_class_student_audio_4: `Audio working fine`,
    feedback_end_class_student_presentation_4: `Learnt a lot from teacher's screen`,
    feedback_end_class_student_other_4: `Other`,
    feedback_end_class_student_video_5: `Video working well`,
    feedback_end_class_student_audio_5: `Audio working well`,
    feedback_end_class_student_presentation_5: `Presentation worked well`,
    feedback_end_class_student_other_5: `Other`,

    feedback_end_class_teacher_video_1: `Terrible video`,
    feedback_end_class_teacher_audio_1: `Terrible audio`,
    feedback_end_class_teacher_presentation_1: `Problem with presenting`,
    feedback_end_class_teacher_other_1: `Problem with other tools`,
    feedback_end_class_teacher_video_2: `Bad video`,
    feedback_end_class_teacher_audio_2: `Bad audio`,
    feedback_end_class_teacher_presentation_2: `Problem with presenting`,
    feedback_end_class_teacher_other_2: `Problem with other tools`,
    feedback_end_class_teacher_video_3: `Video was okay`,
    feedback_end_class_teacher_audio_3: `Audio was okay`,
    feedback_end_class_teacher_presentation_3: `Problem with presenting`,
    feedback_end_class_teacher_other_3: `Problem with other tools`,
    feedback_end_class_teacher_video_4: `Video worked fine`,
    feedback_end_class_teacher_audio_4: `Audio worked fine`,
    feedback_end_class_teacher_presentation_4: `Presentation worked well`,
    feedback_end_class_teacher_other_4: `Useful tools`,
    feedback_end_class_teacher_video_5: `Video worked well`,
    feedback_end_class_teacher_audio_5: `Audio worked well`,
    feedback_end_class_teacher_presentation_5: `Presentation worked well`,
    feedback_end_class_teacher_other_5: `Useful tools`,

    loading_activity_lessonMaterial: `Loading the lesson material!`,
    loading_activity_lessonMaterial_description: `If you still see this screen after {seconds} seconds, click Reload below.`,
    loading_activity_error: `Sorry, something went wrong!`,
    loading_activity_lessonMaterial_clickReload: `Please click the Reload button.`,
    loading_activity_lessonMaterial_reload: `Reload`,

    notification_user_joined: `{user} has joined the class room`,
};
export default messages;

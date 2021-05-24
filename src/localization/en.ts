// en.ts
const messages: Record<string, string> = {
    activity_link: `Activity Link`,

    join_cameraPreviewFallback_allowMediaPermissions: `Allow media device permissions`,
    join_permissionAlertDialog_title: `Allow to use your media device for Kidsloop Live`,
    join_permissionAlertDialog_contentText_live: `Kidsloop Live needs access to the camera and microphone in order for other class participants to see you and hear you.`,
    join_permissionAlertDialog_contentText_classesStudy: `Kidsloop Live needs access to the microphone for in-class interactive contents.`,
    join_permissionAlertDialog_action_close: `Close`,

    camera_participantInfo_chalkboardIcon_tooltip: `{name} is teacher`,
    camera_participantInfo_crownIcon_tooltip: `Teacher {name} is presenting`,
    camera_fullScreenCameraButton_tooltip: `Full screen camera`,
    camera_moreControlsButton_listSubheader_whiteboard: `Give Whiteboard Controls`,
    camera_moreControlsButton_listSubheader_trophy: `Give Trophy`,
    camera_moreControlsButton_listSubheader_toggleCamMic: `Toggle Camera / Microphone`,

    whiteboard_permissionControls_listItemText_disallow: `Disallow drawing`,
    whiteboard_permissionControls_listItemText_allow: `Allow drawing`,
    whiteboard_permissionControls_listItemText_clear: `Clear`,

    allow_media_permission: `Please allow microphone and camera permissions if you want to use media devices.`,
    error_camera_unavailable: `Can not access your 📷`,
    error_empty_name: `Please enter your name.`,
    error_invaild_token: `Invalid token could not connect to class.`,
    error_webrtc_unavailable: `Error: WebRTC context unavailable`,
    error_unknown_content: `Error: Unknown content type`,
    error_unknown_error: `Oops! Something went wrong.`,
    error_unknown_user: `Unknown user`,
    failed_to_connect: `Failed to connect.`,
    hello: `Hello {name}!`,
    waiting_for_class: `Waiting for class to start.`,
    what_is_your_name: `What is your name?`,
    loading: `Loading`,
    loading_text: `Give us a sec while we get things ready!`,
    student_stream_mode: `Your teacher is currently presenting.`,
    student_activity_mode: `Please follow your teacher's intruction.`,
    join_room: `Join Room`,
    no_device_available: `No devices available`,
    no_messages: `No messages yet...`,
    no_participants: `No one has join the class yet...`,
    select_device: `Select {device}`,
    connect_camera: `Connect your 📷`,

    refresh_activity: `Refresh Activity`,
    what_is_this: `What is This?`,
    live_buttonStop: `Stop`,
    live_buttonPresent: `Present`,
    live_buttonObserve: `Observe`,
    live_buttonScreen: `Share Screen`,
    live_buttonStopFull: `Webcam Mode`,
    live_buttonPresentFull: `Presenter Mode`,
    live_buttonObserveFull: `Observation Mode`,
    live_buttonScreenFull: `Share Screen`,
    title_participants: `Participants`,
    title_lesson_plan: `Lesson Plan`,
    title_chat: `Chat`,
    title_whiteboard: `Whiteboard`,
    title_settings: `Settings`,
    invite_students: `Invite`,
    copy_clipboard: `Copied to clipboard!`,
    quick_toggles: `Quick Toggles`,
    set_cameras_off: `Set All Cameras Off`,
    set_cameras_on: `Set All Cameras On`,
    mute_all: `Mute All`,
    unmute_all: `Unmute All`,
    hide_whiteboard: `Hide All Whiteboards`,
    show_whiteboard: `Show All Whiteboards`,
    clear_whiteboard: `Clear All Whiteboards`,
    give_star: `Give Star to all`,
    give_trophy: `Give Trophy to all`,
    give_heart: `Give Heart to all`,
    encourage: `Encourage to all`,
    share_something_here: `Share something here`,
    enable_dark_mode: `Enable dark mode`,
    language: `Language`,
    two_columns: `2 columns`,
    three_columns: `3 columns`,
    four_columns: `4 columns`,
    six_columns: `6 columns`,
    cols_camera_per_row: `# of cameras per row`,
    cols_observe_per_row: `# of student views per row`,

    whiteboard_color: `Color`,
    whiteboard_clear: `Clear`,
    whiteboard_hide: `Hide`,
    whiteboard_show: `Show`,

    turn_off_camera: `Turn off camera`,
    turn_on_camera: `Turn on camera`,
    turn_off_mic: `Turn off microphone`,
    turn_on_mic: `Turn on microphone`,

    browser_guide_title: `Kidsloop Live supports Chrome only.`,
    browser_guide_title_macos: `Kidsloop Live supports Safari and Chrome only on Mac OS.`,
    browser_guide_title_ios: `Kidsloop Live supports Safari only on iOS.`,
    browser_guide_body: `Please download a supported browser and try again.`,

    toolbar_class_details: `Class Details`,
    toolbar_canvas: `Canvas`,
    toolbar_global_actions: `Global Actions`,
    toolbar_global_actions_turn_on_screenshare: `Share screen`,
    toolbar_global_actions_turn_of_screenshare: `Stop sharing screen`,
    toolbar_lesson_plan: `Lesson Plan`,
    toolbar_view_modes: `View Modes`,
    toolbar_view_modes_disabled_screenshare: `View modes option is not available when screen share is active.`,
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
    classdetails_roster_absents: `Absent Students`,
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
    end_class_description: `Ending the class will close session for all users.`,
    leave_class: `Leave Class`,
    leave_class_description: `Leaving the class will close your camera, turn off your microphone, and end the class session.`,
    feedback_not_so_good: `Not so good`,
    feedback_bad: `Bad`,
    feedback_okay: `Okay`,
    feedback_good: `Good`,
    feedback_awesome: `Awesome`,
    class_ended_title: `Class has ended.`,
    class_ended_thanks_for_attending: `Thank you for attending the class!`,
    class_ended_you_have_left: `You have left the class.`,
    class_ended_return_to_hub: `Return to home page`,
    parents_captcha_title: `Parents only`,
    parents_captcha_description: `To continue, please tap the numbers in ascending order`,
    parents_captcha_error: `Error, please try again`,
    notification_user_sent_message: `New message from: {user}`,
    notification_user_is_pinned: `{user} has been pinned`,
    notification_you_have_controls: `You have teacher controls`,
    notification_you_dont_have_controls: `You dont' have teacher controls`,
    notification_user_left: `{user} has left the class rooom`,
    notification_user_muted_microphone: `{user} has turned off their microphone`,
    notification_user_muted_camera: `{user} has turned off their camera`,
    notification_self_muted_user_microphone: `You have turned off {user}'s microphone`,
    notification_self_muted_user_camera: `You have turned off {user}'s camera`,
    notification_self_muted_user_canvas: `You have turned off {user}'s canvas`,
    notification_self_muted_by_user_microphone: `{user} has turned off your microphone`,
    notification_self_muted_by_user_camera: `{user} has turned off your camera`,
    notification_self_muted_by_user_canvas: `{user} has turned off your canvas`,
    notification_global_mute_microphone: `All student microphones have been turned off`,
    notification_global_mute_camera: `All student cameras have been turned off`,
    notification_global_mute_canvas: `All student canvas have been turned off`,
    notification_global_unmute_microphone: `You can turn on your microphone`,
    notification_global_unmute_camera: `You can turn on your camera`,
    notification_new_attachment: `New attachment available`,
    notification_observe_content_interactive: `Content is now interactive`,
    toggle_camera_off: `Turn camera off`,
    toggle_camera_on: `Turn camera on`,
    toggle_all_cameras_off: `Turn all cameras off`,
    toggle_all_cameras_on: `Turn all cameras on`,
    toggle_microphone_on: `Turn microphone on`,
    toggle_microphone_off: `Turn microphone off`,
    toggle_all_microphones_off: `Turn all microphones off`,
    toggle_all_microphones_on: `Turn all microphones on`,
    toggle_all_canvas_off: `Turn all canvases off`,
    toggle_all_canvas_on: `Turn all canvases on`,
    toggle_room_controls: `Give room controls`,
    common_feature_not_available: `This feature is not available yet`,
    common_close_tab: `Close this tab`,
    common_cancel: `Cancel`,
    common_dismiss: `Dismiss`,
    common_submit: `Submit`,
    title_mosaic: `Mosaic Mode (Press 'esc' to exit)`,
    you: `You`,

    classtype_live: `Online`,
    class_ended_how_was_the_class: `How was the class?`,
    whiteboard_eraser: `Eraser`,
    whiteboard_clear_canvas: `Clear canvas`,
    whiteboard_clear_all_canvas: `Clear all canvas`,

    no_teachers_connected: `No teachers connected`,
    no_students_connected: `No students connected`,

    feedback_detail_question: `Do you want to add more details?`,
    feedback_student_video_1: `Terrible video`,
    feedback_student_audio_1: `Terrible audio`,
    feedback_student_presentation_1: `Couldn't see teacher's screen`,
    feedback_student_other_1: `Other`,
    feedback_student_video_2: `Bad video`,
    feedback_student_audio_2: `Bad audio`,
    feedback_student_presentation_2: `Problem with teacher's screen`,
    feedback_student_other_2: `Other`,
    feedback_student_video_3: `Video was okay`,
    feedback_student_audio_3: `Audio was okay`,
    feedback_student_presentation_3: `Problem with teacher's screen`,
    feedback_student_other_3: `Other`,
    feedback_student_video_4: `Video working fine`,
    feedback_student_audio_4: `Audio working fine`,
    feedback_student_presentation_4: `Learnt a lot from teacher's screen`,
    feedback_student_other_4: `Other`,
    feedback_student_video_5: `Video working well`,
    feedback_student_audio_5: `Audio working well`,
    feedback_student_presentation_5: `Presentation worked well`,
    feedback_student_other_5: `Other`,

    feedback_teacher_video_1: `Terrible video`,
    feedback_teacher_audio_1: `Terrible audio`,
    feedback_teacher_presentation_1: `Problem with presenting`,
    feedback_teacher_other_1: `Problem with other tools`,
    feedback_teacher_video_2: `Bad video`,
    feedback_teacher_audio_2: `Bad audio`,
    feedback_teacher_presentation_2: `Problem with presenting`,
    feedback_teacher_other_2: `Problem with other tools`,
    feedback_teacher_video_3: `Video was okay`,
    feedback_teacher_audio_3: `Audio was okay`,
    feedback_teacher_presentation_3: `Problem with presenting`,
    feedback_teacher_other_3: `Problem with other tools`,
    feedback_teacher_video_4: `Video worked fine`,
    feedback_teacher_audio_4: `Audio worked fine`,
    feedback_teacher_presentation_4: `Presentation worked well`,
    feedback_teacher_other_4: `Useful tools`,
    feedback_teacher_video_5: `Video worked well`,
    feedback_teacher_audio_5: `Audio worked well`,
    feedback_teacher_presentation_5: `Presentation worked well`,
    feedback_teacher_other_5: `Useful tools`,
};
export default messages;

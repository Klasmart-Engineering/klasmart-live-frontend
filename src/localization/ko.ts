// ko.ts
const messages: Record<string, string> = {
    activity_link: `액티비티 링크`,

    join_cameraPreviewFallback_allowMediaPermissions: `미디어 장치 권한을 허용하십시오.`,
    join_permissionAlertDialog_title: `Kidsloop Live에서 미디어 장치를 사용하도록 허용하기`,
    join_permissionAlertDialog_contentText_live: `다른 수업 참가자들이 내 모습을 보고 음성을 들으려면 Kidsloop Live에서 카메라와 마이크에 액세스 할 수 있어야 합니다.`,
    join_permissionAlertDialog_contentText_classesStudy: `수업 중 인터랙티브 콘텐츠를 사용하기 위해 Kidsloop Live에서 마이크에 액세스 할 수 있어야 합니다.`,
    join_permissionAlertDialog_action_close: `닫기`,

    camera_participantInfo_chalkboardIcon_tooltip: `{name}은 선생님 입니다`,
    camera_participantInfo_crownIcon_tooltip: `{name} 선생님이 발표 중입니다`,
    camera_fullScreenCameraButton_tooltip: `카메라 전체화면`,
    camera_moreControlsButton_listSubheader_whiteboard: `화이트보드 보여주기`,
    camera_moreControlsButton_listSubheader_trophy: `트로피 주기`,
    camera_moreControlsButton_listSubheader_toggleCamMic: `카메라 / 마이크 전환`,

    whiteboard_permissionControls_listItemText_disallow: `그리기 비활성`,
    whiteboard_permissionControls_listItemText_allow: `그리기 활성`,
    whiteboard_permissionControls_listItemText_clear: `모두 지우기`,

    allow_media_permission: `미디어 장치를 사용하려면 마이크 및 카메라 권한을 허용하십시오.`,
    error_camera_unavailable: `📷에 액세스 할 수 없습니다.`,
    error_empty_name: `이름을 입력하십시오.`,
    error_invaild_token: `권한이 없으므로 수업에 참여할 수 없습니다.`,
    error_webrtc_unavailable: `Error : WebRTC 컨텍스트를 사용할 수 없습니다.`,
    error_unknown_content: `Error: 콘텐츠 유형을 알 수 없습니다.`,
    error_unknown_error: `죄송합니다! 문제가 발생했습니다.`,
    error_unknown_user: `알 수 없는 유저`,
    failed_to_connect: `연결에 실패했습니다.`,
    hello: `안녕, {name}!`,
    waiting_for_class: `수업 시작을 기다리는 중입니다.`,
    what_is_your_name: `이름이 무엇입니까?`,
    loading: `로딩중`,
    loading_text: `준비하는 동안 잠시만 기다려주세요!`,
    student_stream_mode: `현재 선생님이 수업을 진행하고 있습니다.`,
    student_activity_mode: `선생님의 지시에 따르십시오.`,
    join_room: `수업 참여`,
    no_device_available: `사용 가능한 장치가 없습니다.`,
    no_messages: `아직 메시지가 없습니다...`,
    no_participants: `아직 수업에 참여한 사람이 없습니다...`,
    select_device: `{device} 선택`,
    connect_camera: `📷를 연결하십시오.`,

    refresh_activity: `액티비티 새로고침`,
    what_is_this: `이건 어떤 기능인가요?`,
    live_buttonStop: `정지`,
    live_buttonPresent: `수업 진행`,
    live_buttonObserve: `학생관찰`,
    live_buttonScreen: `화면 공유`,
    live_buttonStopFull: `웹캠 모드`,
    live_buttonPresentFull: `발표자 모드`,
    live_buttonObserveFull: `학생관찰 모드`,
    live_buttonScreenFull: `화면 공유`,
    title_participants: `수업 참가자`,
    title_lesson_plan: `수업 계획`,
    title_chat: `채팅`,
    title_whiteboard: `화이트보드`,
    title_settings: `설정`,
    invite_students: `초대`,
    copy_clipboard: `클립 보드에 복사했습니다!`,
    quick_toggles: `빠른 조작`,
    set_cameras_off: `카메라 모두 끄기`,
    set_cameras_on: `카메라 모두 켜기`,
    mute_all: `모두 음소거`,
    unmute_all: `모두 음소거 해제`,
    hide_whiteboard: `모든 화이트보드 숨기기`,
    show_whiteboard: `모든 화이트보드 보이기`,
    clear_whiteboard: `모든 화이트보드 지우기`,
    give_star: `모두에게 별 주기`,
    give_trophy: `모두에게 트로피 주기`,
    give_heart: `모두에게 하트 주기`,
    encourage: `모두에게 격려하기`,
    share_something_here: `공유하고 싶은 것을 올려보세요`,
    enable_dark_mode: `다크 모드 켜기`,
    language: `언어`,
    two_columns: `2 개`,
    three_columns: `3 개`,
    four_columns: `4 개`,
    six_columns: `6 개`,
    cols_camera_per_row: `한 줄에 표시할 카메라 수`,
    cols_observe_per_row: `한 줄에 표시할 학생 화면 수`,

    whiteboard_color: `색깔`,
    whiteboard_clear: `지우기`,
    whiteboard_hide: `숨기기`,
    whiteboard_show: `보기`,

    turn_off_camera: `카메라 끄기`,
    turn_on_camera: `카메라 켜기`,
    turn_off_mic: `마이크 끄기`,
    turn_on_mic: `마이크 켜기`,

    browser_guide_title: `Kidsloop Live는 Chrome 브라우저만을 지원합니다.`,
    browser_guide_title_macos: `Kidsloop Live는 Mac OS에서 Safari와 Chrome 브라우저를 지원합니다.`,
    browser_guide_title_ios: `Kidsloop Live는 iOS에서 Safari 브라우저만을 지원합니다.`,
    browser_guide_body: `지원하는 브라우저를 다운로드 받고 다시 시도해 주세요.`,

    toolbar_class_details: `클래스 상세`,
    toolbar_canvas: `캔버스`,
    toolbar_global_actions: `일괄 조정`,
    toolbar_global_actions_turn_on_screenshare: `스크린 공유하기`,
    toolbar_global_actions_turn_of_screenshare: `스크린 공유 중기`,
    toolbar_lesson_plan: `레슨 플랜`,
    toolbar_view_modes: `보기 모드`,
    toolbar_view_modes_disabled_screenshare: `화면 공유 중에는 보기 모드를 바꿀 수 없습니다.`,
    toolbar_chat: `채팅`,
    toolbar_endcall_ask_to_leave: `클래스 나가기 요청`,
    toolbar_microphonelocked: `선생님이 당신의 음성입력을 비활성화했습니다.`,
    toolbar_camera_locked: `선생님이 당신의 화면을 비활성화했습니다.`,
    classdetails_details: `클래스 상세`,
    classdetails_class_name: `클래스 이름`,
    classdetails_lesson_name: `레슨명`,
    classdetails_room_id: `Room ID`,
    classdetails_class_type: `클래스 타입`,
    classdetails_enrolled_participants: `등록된 참석자`,
    classdetails_program: `프로그램`,
    classdetails_subject: `과목`,
    classdetails_lesson_materials: `수업 재료`,
    classdetails_start_time: `시작 시간`,
    classdetails_end_time: `종료 시간`,
    classdetails_roster: `클래스 구성`,
    classdetails_roster_teachers: `선생님`,
    classdetails_roster_students: `학습자`,
    classdetails_roster_absents: `결석자`,
    viewmodes_on_stage: `스테이지 모드`,
    viewmodes_observe: `관찰 모드`,
    viewmodes_present: `발표 모드`,
    chat_messages: `메시지`,
    chat_messages_write_placeholder: `메시지를 쓰세요`,
    chat_messages_noresults: `메시지 없음`,
    chat_attachments: `첨부파일`,
    chat_attachments_download_label: `첨부파일 받기`,
    chat_attachments_upload: `업로드`,
    chat_attachments_noresults: `첨부파일 없음`,
    lessonplan_content: `콘텐츠`,
    lessonplan_content_noresults: `레슨 재료 없음`,
    lessonplan_manuals: `교사 매뉴얼`,
    lessonplan_manuals_noresults: `교사 매뉴얼 없음`,
    settings_menu_settings: `세팅`,
    settings_menu_schedule: `스케줄`,
    settings_menu_toolbar: `툴바`,
    settings_menu_record: `녹화`,
    settings_language_title: `언어`,
    settings_language_select_language: `언어를 선택하세요`,
    end_class: `수업 종료`,
    end_class_confirm: `수업을 정말 종료하시겠습니까?`,
    end_class_description: `종료 시 모든 사용자도 수업에서 나가게 됩니다.`,
    leave_class: `수업에서 나가기`,
    leave_class_description: `수업에서 나가면 화면과 음성 송출이 중단되며, 수업 세션을 종료하게 됩니다.`,
    feedback_terrible: `매우 나쁨`,
    feedback_bad: `나쁨`,
    feedback_okay: `보통`,
    feedback_good: `좋음`,
    feedback_great: `매우 좋음`,
    class_ended_title: `수업이 종료되었습니다.`,
    class_ended_thanks_for_attending: `수업에 참석해 주셔서 감사합니다!`,
    class_ended_you_have_left: `수업에서 나왔습니다.`,
    class_ended_return_to_hub: `홈페이지로 돌아갑니다.`,
    parents_captcha_title: `학부모 전용`,
    parents_captcha_description: `계속하시려면, 작은 숫자부터 큰 숫자까지 순서대로 골라 주세요.`,
    parents_captcha_error: `다시 시도해 주세요.`,
    notification_user_sent_message: `{user}으로부터 메시지를 받았습니다.`,
    notification_user_is_pinned: `{user}를 고정하였습니다.`,
    notification_you_have_controls: `교사 컨트롤 권한이 있습니다.`,
    notification_you_dont_have_controls: `교사 컨트롤 권한이 없습니다.`,
    notification_user_left: `사용자({user})가 수업에서 나갔습니다.`,
    notification_user_muted_microphone: `사용자({user})의 마이크가 꺼졌습니다.`,
    notification_user_muted_camera: `사용자({user})의 카메라가 꺼졌습니다.`,
    notification_self_muted_user_microphone: `사용자({user})의 마이크를 중단했습니다.`,
    notification_self_muted_user_camera: `사용자({user})의 카메라를 중단했습니다.`,
    notification_self_muted_user_canvas: `사용자({user})의 캔버스 기능을 중단했습니다.`,
    notification_self_muted_by_user_microphone: `사용자({user})가 당신의 마이크를 중단했습니다.`,
    notification_self_muted_by_user_camera: `사용자({user})가 당신의 카메라를 중단했습니다.`,
    notification_self_muted_by_user_canvas: `사용자({user})가 당신의 캔버스 기능을 중단했습니다.`,
    notification_global_mute_microphone: `모든 학습자의 마이크가 중단되었습니다.`,
    notification_global_mute_camera: `모든 학습자의 카메라가 중단되었습니다.`,
    notification_global_mute_canvas: `모든 학습자의 캔버스 기능이 중단되었습니다.`,
    notification_global_unmute_microphone: `마이크를 시작할 수 있습니다.`,
    notification_global_unmute_camera: `카메라를 시작할 수 있습니다.`,
    notification_new_attachment: `새로운 첨부파일을 사용할 수 있습니다.`,
    notification_observe_content_interactive: `이제 인터랙티브 콘텐츠를 사용할 수 있습니다.`,
    toggle_camera_off: `카메라 끄기`,
    toggle_camera_on: `카메라 켜기`,
    toggle_all_cameras_off: `모든 카메라 끄기`,
    toggle_all_cameras_on: `모든 카메라 켜기`,
    toggle_microphone_on: `마이크 켜기`,
    toggle_microphone_off: `마이크 끄기`,
    toggle_all_microphones_off: `모든 마이크 끄기`,
    toggle_all_microphones_on: `모든 마이크 켜기`,
    toggle_all_canvas_off: `모든 캔버스 끄기`,
    toggle_all_canvas_on: `모든 캔버스 켜기`,
    toggle_room_controls: `컨트롤 권한 주기`,
    common_feature_not_available: `이 기능은 아직 사용불가합니다.`,
    common_close_tab: `탭 닫기`,
    common_cancel: `취소`,
    common_dismiss: `무시`,
    common_submit: `제출`,
    title_mosaic: `모자이크 모드 (종료 시 esc 버튼 이용)`,
    you: `나`,

    classtype_live: `온라인`,
    class_ended_how_was_the_class: `오늘 수업은 어땠나요?`,
    whiteboard_eraser: `지우개`,
    whiteboard_clear_canvas: `캔버스 지우기`,
    whiteboard_clear_all_canvas: `모든 캔버스 지우기`,

    no_teachers_connected: `연결된 교사가 없습니다.`,
    no_students_connected: `연결된 학생이 없습니다.`,
};
export default messages;

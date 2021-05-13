// vi.ts
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

    activity_link: "Đường dẫn đến Hoạt động",

    join_live: "Joining Live...",
    join_cameraPreviewFallback_allowMediaPermissions: "Cho phép truy máy ảnh",
    join_permissionAlertDialog_title: "Cho phép KidsLoop Live truy cập phương tiện truyền thông của bạn",
    join_permissionAlertDialog_contentText_live: "Kidsloop Live cần truy cập vào máy ảnh và micrô để những người tham gia lớp học khác có thể nhìn thấy bạn và nghe thấy bạn.",
    join_permissionAlertDialog_contentText_classesStudy: "Kidsloop Live cần truy cập vào micrô cho nội dung của lớp học tương tác",
    join_permissionAlertDialog_action_close: "Đóng",

    camera_participantInfo_chalkboardIcon_tooltip: "{tên} là giáo viên",
    camera_participantInfo_crownIcon_tooltip: "Giáo viên {tên} đang có mặt",
    camera_fullScreenCameraButton_tooltip: "Toàn màn hình",
    camera_moreControlsButton_listSubheader_whiteboard: "Cho phép sử dụng bảng trắng",
    camera_moreControlsButton_listSubheader_trophy: "Trao cúp thưởng",
    camera_moreControlsButton_listSubheader_toggleCamMic: "Chuyển đổi máy ảnh / micrô",

    whiteboard_permissionControls_listItemText_disallow: "Không cho phép vẽ",
    whiteboard_permissionControls_listItemText_allow: "Cho phép vẽ",
    whiteboard_permissionControls_listItemText_clear: "Xóa",

    allow_media_permission: "Nếu bạn muốn sử dụng các thiết bị truyền thông, vui lòng cho phép sử dụng micrô và máy ảnh của bạn.",
    button_cancel: "Cancel",
    button_confirm: "Confirm",
    error_camera_unavailable: "Không thể truy cập 📷",
    error_empty_name: "Vui lòng nhập tên.",
    error_invaild_token: "Không được cấp phép nên không thể tham gia lớp học.",
    error_webrtc_unavailable: "Lỗi: Không có ngữ cảnh WebRTC",
    error_unknown_content: "Lỗi: Loại nội dung không xác định",
    error_unknown_error: "Tiếc quá! Có lỗi xảy ra.",
    error_unknown_user: "Người dùng không xác định",
    failed_to_connect: "Kết nối thất bại.",
    hello: "Xin chào {name}!",
    waiting_for_class: "Chờ lớp học bắt đầu.",
    what_is_your_name: "Bạn tên gì?",
    loading: "Vui lòng chờ trong giây lát!",
    loading_text: "Vui lòng chờ trong giây lát!",
    student_stream_mode: "Giáo viên của bạn đang trình bày.",
    student_activity_mode: "Vui lòng làm theo hướng dẫn của giáo viên.",
    join_room: "Vào lớp",
    no_device_available: "Không có thiết bị",
    no_messages: "Hiện tại chưa có thông tin...",
    no_participants: "Chưa có ai vào lớp",
    select_device: "Chọn {device}",
    connect_camera: "Kết nối 📷",

    refresh_activity: "Làm mới Hoạt động",
    what_is_this: "Cái gì đây?",
    live_buttonStop: "Ngưng",
    live_buttonPresent: "Trình bày",
    live_buttonObserve: "Chế độ học sinh",
    live_buttonScreen: "Chia sẻ màn hình",
    live_buttonStopFull: "Chế Độ Webcam",
    live_buttonPresentFull: "Chế Độ Trình Chiếu",
    live_buttonObserveFull: "Chế Độ Xem",
    live_buttonScreenFull: "Chế Độ Chia Sẻ Màn Hình",
    title_participants: "Những người tham gia",
    title_lesson_plan: "Giáo án",
    title_chat: "Trò chuyện",
    title_whiteboard: "Bảng",
    title_settings: "Cài đặt",
    title_end_class: "End Class",
    end_class_title: "End the class?",
    invite_students: "Mời",
    copy_clipboard: "Sao chép vào bảng tạm!",
    quick_toggles: "Chuyển đổi nhanh",
    set_cameras_off: "Tắt máy ảnh",
    set_cameras_on: "Bật máy ảnh",
    mute_all: "Tắt tiếng",
    unmute_all: "Bật tiếng",
    hide_whiteboard: "Ẩn Toàn Bộ Bảng",
    show_whiteboard: "Hiện Toàn Bộ Bảng",
    clear_whiteboard: "Xóa Toàn Bộ Bảng",
    give_star: "Gửi Sao tới toàn bộ",
    give_trophy: "Gửi Cúp tới toàn bộ",
    give_heart: "Gửi Tim tới toàn bộ",
    encourage: "Khuyến khích tất cả",
    share_something_here: "Trò chuyện tại đây",
    enable_dark_mode: "Bật chế độ nền tối",
    language: "Ngôn ngữ",
    two_columns: "2 cột",
    three_columns: "3 cột",
    four_columns: "4 cột",
    six_columns: "6 cột",
    cols_camera_per_row: "# Camera mỗi hàng",
    cols_observe_per_row: "Số lượng màn hình học viên được hiển thị trên một hàng",

    whiteboard_color: "Màu",
    whiteboard_clear: "Xóa",
    whiteboard_hide: "Ẩn",
    whiteboard_show: "Hiện",

    turn_off_camera: "Tắt camera",
    turn_on_camera: "Bật camera",
    turn_off_mic: "Tắt tiếng",
    turn_on_mic: "Bật tiếng",

    browser_guide_title: "Kidsloop Live chỉ hỗ trợ trình duyệt Chrome",
    browser_guide_title_macos: "Kidsloop Live chỉ hỗ trợ trình duyệt Chrome và Safari trên máy Mac",
    browser_guide_title_ios: "Kidsloop Live chỉ hỗ trợ Safari cho IOS",
    browser_guide_body: "Xin hãy download trình duyệt được hỗ trợ và thử lại",

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
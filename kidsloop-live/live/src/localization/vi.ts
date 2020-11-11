// vi.ts
const messages: Record<string, string> = {
    err_400_title: "Bad Request",
    err_400_description: "The server could not understand the request due to invalid syntax",
    err_401_title: "Unauthorized",
    err_401_description: "Please check if you are signed in",
    err_403_title: "Forbidden",
    err_403_description: "You don't have permission to access",
    err_404_title: "Not Found",
    err_404_description: "The requested URL was not found",
    err_500_title: "Internal Server Error",
    err_500_description: "Oops! Something went wrong",

    selectOrg_title: "Which Organization?",
    selectOrg_buttonSelect: "Select",

    activity_link: "Đường dẫn đến Hoạt động",
    allow_media_permission: "Nếu bạn muốn sử dụng các thiết bị truyền thông, vui lòng cho phép sử dụng micrô và máy ảnh của bạn.",
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

};
export default messages;
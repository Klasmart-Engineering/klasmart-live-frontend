// vi.ts
const messages: Record<string, string> = {
    activity_link: `Đường dẫn đến Hoạt động`,

    join_cameraPreviewFallback_allowMediaPermissions: `Cho phép truy máy ảnh`,
    join_permissionAlertDialog_title: `Cho phép KidsLoop Live truy cập phương tiện truyền thông của bạn`,
    join_permissionAlertDialog_contentText_live: `Kidsloop Live cần truy cập vào máy ảnh và micrô để những người tham gia lớp học khác có thể nhìn thấy bạn và nghe thấy bạn.`,
    join_permissionAlertDialog_contentText_classesStudy: `Kidsloop Live cần truy cập vào micrô cho nội dung của lớp học tương tác`,
    join_permissionAlertDialog_action_close: `Đóng`,

    camera_participantInfo_chalkboardIcon_tooltip: `{tên} là giáo viên`,
    camera_participantInfo_crownIcon_tooltip: `Giáo viên {tên} đang có mặt`,
    camera_fullScreenCameraButton_tooltip: `Toàn màn hình`,
    camera_moreControlsButton_listSubheader_whiteboard: `Cho phép sử dụng bảng trắng`,
    camera_moreControlsButton_listSubheader_trophy: `Trao cúp thưởng`,
    camera_moreControlsButton_listSubheader_toggleCamMic: `Chuyển đổi máy ảnh / micrô`,

    whiteboard_permissionControls_listItemText_disallow: `Không cho phép vẽ`,
    whiteboard_permissionControls_listItemText_allow: `Cho phép vẽ`,
    whiteboard_permissionControls_listItemText_clear: `Xóa`,

    allow_media_permission: `Nếu bạn muốn sử dụng các thiết bị truyền thông, vui lòng cho phép sử dụng micrô và máy ảnh của bạn.`,
    error_camera_unavailable: `Không thể truy cập 📷`,
    error_empty_name: `Vui lòng nhập tên.`,
    error_invaild_token: `Không được cấp phép nên không thể tham gia lớp học.`,
    error_webrtc_unavailable: `Lỗi: Không có ngữ cảnh WebRTC`,
    error_unknown_content: `Lỗi: Loại nội dung không xác định`,
    error_unknown_error: `Tiếc quá! Có lỗi xảy ra.`,
    error_unknown_user: `Người dùng không xác định`,
    failed_to_connect: `Kết nối thất bại.`,
    hello: `Xin chào {name}!`,
    waiting_for_class: `Chờ lớp học bắt đầu.`,
    what_is_your_name: `Bạn tên gì?`,
    loading: `Vui lòng chờ trong giây lát!`,
    loading_text: `Vui lòng chờ trong giây lát!`,
    student_stream_mode: `Giáo viên của bạn đang trình bày.`,
    student_activity_mode: `Vui lòng làm theo hướng dẫn của giáo viên.`,
    join_room: `Vào lớp`,
    no_device_available: `Không có thiết bị`,
    no_messages: `Hiện tại chưa có thông tin...`,
    no_participants: `Chưa có ai vào lớp`,
    select_device: `Chọn {device}`,
    connect_camera: `Kết nối 📷`,

    refresh_activity: `Làm mới Hoạt động`,
    what_is_this: `Cái gì đây?`,
    live_buttonStop: `Ngưng`,
    live_buttonPresent: `Trình bày`,
    live_buttonObserve: `Chế độ học sinh`,
    live_buttonScreen: `Chia sẻ màn hình`,
    live_buttonStopFull: `Chế Độ Webcam`,
    live_buttonPresentFull: `Chế Độ Trình Chiếu`,
    live_buttonObserveFull: `Chế Độ Xem`,
    live_buttonScreenFull: `Chế Độ Chia Sẻ Màn Hình`,
    title_participants: `Những người tham gia`,
    title_lesson_plan: `Giáo án`,
    title_chat: `Trò chuyện`,
    title_whiteboard: `Bảng`,
    title_settings: `Cài đặt`,
    invite_students: `Mời`,
    copy_clipboard: `Sao chép vào bảng tạm!`,
    quick_toggles: `Chuyển đổi nhanh`,
    set_cameras_off: `Tắt máy ảnh`,
    set_cameras_on: `Bật máy ảnh`,
    mute_all: `Tắt tiếng`,
    unmute_all: `Bật tiếng`,
    hide_whiteboard: `Ẩn Toàn Bộ Bảng`,
    show_whiteboard: `Hiện Toàn Bộ Bảng`,
    clear_whiteboard: `Xóa Toàn Bộ Bảng`,
    give_star: `Gửi Sao tới toàn bộ`,
    give_trophy: `Gửi Cúp tới toàn bộ`,
    give_heart: `Gửi Tim tới toàn bộ`,
    encourage: `Khuyến khích tất cả`,
    share_something_here: `Trò chuyện tại đây`,
    enable_dark_mode: `Bật chế độ nền tối`,
    language: `Ngôn ngữ`,
    two_columns: `2 cột`,
    three_columns: `3 cột`,
    four_columns: `4 cột`,
    six_columns: `6 cột`,
    cols_camera_per_row: `# Camera mỗi hàng`,
    cols_observe_per_row: `Số lượng màn hình học viên được hiển thị trên một hàng`,

    whiteboard_color: `Màu`,
    whiteboard_clear: `Xóa`,
    whiteboard_hide: `Ẩn`,
    whiteboard_show: `Hiện`,

    turn_off_camera: `Tắt camera`,
    turn_on_camera: `Bật camera`,
    turn_off_mic: `Tắt tiếng`,
    turn_on_mic: `Bật tiếng`,

    browser_guide_title: `Kidsloop Live chỉ hỗ trợ trình duyệt Chrome`,
    browser_guide_title_macos: `Kidsloop Live chỉ hỗ trợ trình duyệt Chrome và Safari trên máy Mac`,
    browser_guide_title_ios: `Kidsloop Live chỉ hỗ trợ Safari cho IOS`,
    browser_guide_body: `Xin hãy download trình duyệt được hỗ trợ và thử lại`,

    toolbar_class_details: `Chi tiết lớp học`,
    toolbar_canvas: `Bảng trắng`,
    toolbar_global_actions: `Hành động chung`,
    toolbar_global_actions_turn_on_screenshare: `Chia sẻ màn hình`,
    toolbar_global_actions_turn_of_screenshare: `Dừng chia sẻ màn hình`,
    toolbar_lesson_plan: `Bài giảng`,
    toolbar_view_modes: `Chế độ xem`,
    toolbar_view_modes_disabled_screenshare: `Tùy chọn chế độ xem không khả dụng khi chia sẻ màn hình`,
    toolbar_chat: `Trò chuyện`,
    toolbar_endcall_ask_to_leave: `Xin phép để rời khỏi lớp`,
    toolbar_microphonelocked: `Giáo viên đã tắt micrô của bạn`,
    toolbar_camera_locked: `Giáo viên đã tắt máy ảnh của bạn`,
    classdetails_details: `Chi tiết lớp học`,
    classdetails_class_name: `Tên lớp học`,
    classdetails_lesson_name: `Tên bài học`,
    classdetails_room_id: `Mã lớp học`,
    classdetails_class_type: `Loại lớp học`,
    classdetails_enrolled_participants: `Người tham gia đã đăng ký`,
    classdetails_program: `Chương trình`,
    classdetails_subject: `Môn học`,
    classdetails_lesson_materials: `Học liệu`,
    classdetails_start_time: `Thời gian bắt đầu`,
    classdetails_end_time: `Thời gian kết thúc`,
    classdetails_roster: `Danh sách lớp`,
    classdetails_roster_teachers: `Giáo viên`,
    classdetails_roster_students: `Học sinh`,
    classdetails_roster_absents: `Học sinh vắng mặt`,
    viewmodes_on_stage: `Chế độ mặc định`,
    viewmodes_observe: `Quan sát`,
    viewmodes_present: `Hiện diện`,
    chat_messages: `Tin nhắn`,
    chat_messages_write_placeholder: `Viết tin nhắn`,
    chat_messages_noresults: `Không có tin nhắn`,
    chat_attachments: `Tập tin đính kèm`,
    chat_attachments_download_label: `Tải tập tin đính kèm`,
    chat_attachments_upload: `Tải lên`,
    chat_attachments_noresults: `Không có tập tin đính kèm`,
    lessonplan_content: `Nội dung`,
    lessonplan_content_noresults: `Không có học liệu`,
    lessonplan_manuals: `Hướng dẫn dành cho giáo viên`,
    lessonplan_manuals_noresults: `Không có hướng dẫn dành cho giáo viên`,
    settings_menu_settings: `Cài đặt`,
    settings_menu_schedule: `Thời khóa biểu`,
    settings_menu_toolbar: `Thanh công cụ`,
    settings_menu_record: `Ghi lại`,
    settings_language_title: `Ngôn ngữ`,
    settings_language_select_language: `Chọn ngôn ngữ`,
    end_class: `Lớp học kết thúc`,
    end_class_confirm: `Bạn có chắc muốn kết thúc lớp học không?`,
    end_class_description: `Lớp học kết thúc sẽ đóng cho tất cả người dùng.`,
    leave_class: `Rời khỏi lớp học`,
    leave_class_description: `Rời khỏi lớp học sẽ tắt máy ảnh, tắt micrô của bạn và kết thúc buổi học.`,
    feedback_terrible: `Rất tệ`,
    feedback_bad: `Tệ`,
    feedback_okay: `Tạm ổn`,
    feedback_good: `Tốt`,
    feedback_great: `Xuất sắc`,
    class_ended_title: `Lớp học đã kết thúc.`,
    class_ended_thanks_for_attending: `Cảm ơn bạn đã tham gia lớp học!`,
    class_ended_you_have_left: `Bạn đã rời khỏi lớp học.`,
    class_ended_return_to_hub: `Trở về trang chủ.`,
    parents_captcha_title: `Chỉ dành cho phụ huynh`,
    parents_captcha_description: `Để tiếp tục vui lòng chọn số theo thứ tự tăng dần.`,
    parents_captcha_error: `Xảy ra lỗi. Vui lòng thử lại.`,
    notification_user_sent_message: `Thông báo mới từ: {user}`,
    notification_user_is_pinned: `{user} đã được ghim`,
    notification_you_have_controls: `Bạn có quyền kiểm soát của giáo viên.`,
    notification_you_dont_have_controls: `Bạn không có quyền kiểm soát của giáo viên.`,
    notification_user_left: `{user} đã rời khỏi lớp.`,
    notification_user_muted_microphone: `{user} đã tắt micrô của họ.`,
    notification_user_muted_camera: `{user} đã tắt máy ảnh của họ.`,
    notification_self_muted_user_microphone: `Bạn đã tắt micrô của {user}.`,
    notification_self_muted_user_camera: `Bạn đã tắt máy ảnh của {user}.`,
    notification_self_muted_user_canvas: `Bạn đã tắt bảng trắng của {user}.`,
    notification_self_muted_by_user_microphone: `{user} đã tắt micrô của bạn.`,
    notification_self_muted_by_user_camera: `{user} đã tắt máy ảnh của bạn.`,
    notification_self_muted_by_user_canvas: `{user} đã tắt bảng trắng của bạn.`,
    notification_global_mute_microphone: `Micrô của tất cả học sinh đã được tắt.`,
    notification_global_mute_camera: `Máy ảnh của tất cả học sinh đã được tắt.`,
    notification_global_mute_canvas: `Bảng trắng của tất cả học sinh đã được tắt.`,
    notification_global_unmute_microphone: `Bạn có thể mở micrô của bạn.`,
    notification_global_unmute_camera: `Bạn có mở máy ảnh của bạn.`,
    notification_new_attachment: `Tập tin đính kèm đã có sẵn.`,
    notification_observe_content_interactive: ` Nội dung được tương tác.`,
    toggle_camera_off: `Tắt máy ảnh`,
    toggle_camera_on: `Mở máy ảnh`,
    toggle_all_cameras_off: `Tắt tất cả máy ảnh`,
    toggle_all_cameras_on: `Mở tất cả máy ảnh`,
    toggle_microphone_on: `Mở micrô`,
    toggle_microphone_off: `Tắt micrô`,
    toggle_all_microphones_off: `Tắt tất cả micrô`,
    toggle_all_microphones_on: `Mở tất cả micrô`,
    toggle_all_canvas_off: `Tắt tất cả bảng trắng`,
    toggle_all_canvas_on: `Mở tất cả bảng trắng`,
    toggle_room_controls: `Cung cấp quyền kiểm soát phòng`,
    common_feature_not_available: `Tính năng này chưa có sẵn`,
    common_close_tab: `Đóng cửa sổ này`,
    common_cancel: `Hủy`,
    common_dismiss: `Bỏ qua`,
    common_submit: `Gửi đi`,
    title_mosaic: `Chế độ mosaic (Ấn 'esc' để thoát)`,
    you: `Bạn`,

    classtype_live: `Trực tuyến`,
    class_ended_how_was_the_class: `Lớp học như thế nào?`,
    whiteboard_eraser: `Cục gôm`,
    whiteboard_clear_canvas: `Xóa bảng trắng`,
    whiteboard_clear_all_canvas: `Xóa tất cả bảng trắng`,
};
export default messages;

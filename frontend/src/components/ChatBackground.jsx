import React, { forwardRef } from 'react';
import banner3 from '../assets/banner3.png';

const ChatBackground = forwardRef(({ children, className = '' }, ref) => {
  return (
    <div className="relative flex-1 overflow-hidden bg-slate-50">
      {/* Ảnh nền */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${banner3})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Lớp phủ mờ (Overlay) giúp phần chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
      </div>
      
      {/* Vùng cuộn chứa nội dung tin nhắn */}
      <div ref={ref} className={`relative z-10 h-full overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
});

export default ChatBackground;
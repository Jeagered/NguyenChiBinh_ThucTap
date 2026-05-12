import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:20px_20px]">
            <Header variant="compact" />

            <main className="flex-1 py-12 lg:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">

                    <div className="mb-16 text-center rounded-2xl bg-white/70 p-10 backdrop-blur-md shadow-sm border border-white">
                        <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-orange-600">
                            Về chúng tôi
                        </p>
                        <h1 className="mt-3 text-4xl font-black uppercase tracking-wide text-slate-950 md:text-5xl">
                            Giới thiệu <span className="text-orange-500">THUCTAPGROUP</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-600">
                            Đối tác tin cậy cung cấp các thiết bị, dịch vụ gia công và giải pháp kỹ thuật cơ khí hàng đầu dành cho doanh nghiệp của bạn.
                        </p>
                    </div>

                    <div className="mb-16 flex flex-col items-center gap-12 lg:flex-row">
                        <div className="w-full flex flex-col gap-8 lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                                alt="Máy móc gia công cơ khí"
                                className="h-auto w-full rounded-xl border border-slate-200 object-cover shadow-lg"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
                                alt="Sản xuất cơ khí chính xác"
                                className="h-auto w-full rounded-xl border border-slate-200 object-cover shadow-lg"
                            />
                        </div>
                        <div className="w-full space-y-6 lg:w-1/2">
                            <h2 className="text-3xl font-black uppercase tracking-wide text-slate-900">
                                Giải pháp cơ khí chính xác
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-700 text-justify">
                                THUCTAPGROUP được thành lập với sứ mệnh mang đến những giải pháp tối ưu và toàn diện nhất trong lĩnh vực cơ khí chế tạo, gia công chính xác và tự động hóa dây chuyền. Chúng tôi không ngừng nỗ lực đổi mới công nghệ, cập nhật các xu hướng sản xuất tiên tiến trên thế giới và liên tục nâng cấp hệ thống thiết bị máy móc nhằm đáp ứng các tiêu chuẩn khắt khe nhất từ khách hàng, từ việc gia công các chi tiết đơn giản đến lắp ráp các cụm máy phức tạp đòi hỏi dung sai cực nhỏ.
                            </p>
                            <p className="text-lg leading-relaxed text-slate-700 text-justify">
                                Trải qua chặng đường dài hình thành và phát triển, từ một xưởng gia công quy mô vừa, chúng tôi đã vươn mình trở thành một trong những đơn vị tiên phong trong ngành. THUCTAPGROUP tự hào sở hữu quy trình sản xuất khép kín, ứng dụng nghiêm ngặt hệ thống quản lý chất lượng theo tiêu chuẩn quốc tế ISO. Mọi công đoạn từ khâu tiếp nhận bản vẽ, thiết kế 3D, lập trình gia công đến kiểm tra chất lượng (QC) trước khi xuất xưởng đều được kiểm soát kỹ lưỡng.
                            </p>
                            <p className="text-lg leading-relaxed text-slate-700 text-justify">
                                Yếu tố con người luôn được chúng tôi đặt làm trọng tâm. Đội ngũ kỹ sư, chuyên gia tại THUCTAPGROUP là những người đam mê kỹ thuật, được đào tạo bài bản và có nhiều năm kinh nghiệm thực chiến với các hệ thống máy CNC thế hệ mới nhất (như máy tiện 5 trục, máy phay CNC tốc độ cao, máy cắt dây EDM) được nhập khẩu trực tiếp từ Nhật Bản, Đức và Đài Loan. Sự kết hợp hoàn hảo giữa trí tuệ con người và sức mạnh của công nghệ hiện đại chính là chìa khóa giúp chúng tôi luôn duy trì được lợi thế cạnh tranh vượt trội.
                            </p>
                            <p className="text-lg leading-relaxed text-slate-700 text-justify">
                                Chúng tôi cam kết không chỉ đơn thuần đóng vai trò là một nhà cung cấp thiết bị, mà còn khao khát trở thành một đối tác chiến lược dài hạn, đồng hành sát cánh cùng sự phát triển bền vững của doanh nghiệp bạn. Dịch vụ tư vấn kỹ thuật chuyên sâu, quy trình tối ưu hóa chi phí sản xuất, cùng chính sách hậu mãi, bảo hành và bảo trì tận tâm là những giá trị gia tăng cốt lõi mà chúng tôi tự hào mang lại cho mọi khách hàng.
                            </p>
                            <p className="text-lg leading-relaxed text-slate-700 text-justify font-medium">
                                Cho đến nay, chúng tôi đã vinh dự được hợp tác và trở thành mảnh ghép quan trọng trong chuỗi cung ứng của hàng trăm doanh nghiệp lớn nhỏ ở cả thị trường nội địa và quốc tế. Bằng kinh nghiệm thực tiễn phong phú và tâm huyết cháy bỏng với nghề, sự tin tưởng và hài lòng tuyệt đối của quý khách hàng chính là thước đo cao nhất cho sự thành công và phát triển của THUCTAPGROUP. Chúng tôi luôn trong tâm thế sẵn sàng đón nhận những thách thức công nghệ mới để cùng bạn kiến tạo nên một tương lai công nghiệp thịnh vượng.
                            </p>
                        </div>
                    </div>

                    <div className="mb-24">
                        <img
                            src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop"
                            alt="Hệ thống tự động hóa nhà máy"
                            className="h-72 w-full rounded-xl border border-slate-200 object-cover shadow-lg md:h-96"
                        />
                    </div>

                    <div className="mb-24">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-black uppercase tracking-wide text-slate-950">Tầm nhìn & Sứ mệnh</h2>
                        </div>
                        <div className="grid gap-12 md:grid-cols-2">
                            <div className="overflow-hidden rounded-2xl border border-white bg-white/80 backdrop-blur-md shadow-sm transition-shadow hover:shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=2073&auto=format&fit=crop"
                                    alt="Tầm nhìn doanh nghiệp"
                                    className="h-64 w-full object-cover"
                                />
                                <div className="p-8">
                                    <h3 className="mb-4 text-2xl font-black uppercase tracking-wide text-orange-600">Tầm nhìn</h3>
                                    <p className="text-lg leading-relaxed text-slate-700 font-medium">
                                        Trở thành doanh nghiệp hàng đầu tại Việt Nam và khu vực trong lĩnh vực cung cấp thiết bị, giải pháp cơ khí chính xác, tự động hóa, góp phần thúc đẩy sự phát triển của ngành công nghiệp phụ trợ.
                                    </p>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-white bg-white/80 backdrop-blur-md shadow-sm transition-shadow hover:shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2062&auto=format&fit=crop"
                                    alt="Sứ mệnh doanh nghiệp"
                                    className="h-64 w-full object-cover"
                                />
                                <div className="p-8">
                                    <h3 className="mb-4 text-2xl font-black uppercase tracking-wide text-orange-600">Sứ mệnh</h3>
                                    <p className="text-lg leading-relaxed text-slate-700 font-medium">
                                        Cung cấp các sản phẩm và dịch vụ gia công chất lượng cao, tối ưu hóa quy trình sản xuất nhằm mang lại giá trị gia tăng tối đa và bền vững cho khách hàng, đối tác cùng cộng đồng xã hội.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-black uppercase tracking-wide text-slate-950">Giá trị cốt lõi</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                            <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-slate-900">Chất lượng quốc tế</h3>
                                <p className="font-medium text-slate-600">Áp dụng tiêu chuẩn quốc tế vào từng công đoạn sản xuất và kiểm định khắt khe.</p>
                            </div>

                            <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-slate-900">Tay nghề cao</h3>
                                <p className="font-medium text-slate-600">Đội ngũ kỹ sư, công nhân kỹ thuật tận tâm, giàu kinh nghiệm và chuyên môn giỏi.</p>
                            </div>

                            <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-slate-900">Giao hàng đúng hạn</h3>
                                <p className="font-medium text-slate-600">Cam kết tiến độ dự án, đảm bảo thời gian bàn giao và lắp đặt nhanh chóng nhất.</p>
                            </div>

                            <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-md p-8 text-center shadow-sm transition-transform hover:-translate-y-2">
                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="mb-3 text-lg font-black uppercase tracking-wide text-slate-900">Giá thành tối ưu</h3>
                                <p className="font-medium text-slate-600">Làm chủ công nghệ giúp chúng tôi cung cấp giải pháp với chi phí hợp lý, cạnh tranh.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
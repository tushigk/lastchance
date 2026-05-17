import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0a11] text-white">
      <div className="max-w-[760px] mx-auto px-6 py-16">

        {/* Back */}
        <Link href="/register" className="inline-flex items-center gap-2 text-[14px] text-white/40 hover:text-white/70 transition-colors mb-10 no-underline">
          ← Буцах
        </Link>

        <h1 className="text-[32px] font-black mb-2">Нууцлалын бодлого</h1>
        <p className="text-[14px] text-white/40 mb-12">Сүүлд шинэчилсэн: 2026 оны 5-р сар</p>

        <div className="flex flex-col gap-10 text-[15px] text-white/75 leading-relaxed">

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">1. Ерөнхий мэдээлэл</h2>
            <p>
              Khuslen платформ нь таны хувийн мэдээллийг хуулийн дагуу цуглуулж, хадгалж, ашигладаг.
              Энэхүү нууцлалын бодлого нь бид таны мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалдаг талаар тайлбарласан болно.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">2. Цуглуулдаг мэдээлэл</h2>
            <p className="mb-3">Бид дараах мэдээллийг цуглуулдаг:</p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">Нэр, утасны дугаар, хүйс — бүртгэлийн үед</li>
              <li className="list-disc">Профайл зураг, намтар — хэрэглэгч өөрөө оруулсан тохиолдолд</li>
              <li className="list-disc">Платформ дотор хийсэн үйлдлүүд (like, swipe, мессеж)</li>
              <li className="list-disc">Төлбөрийн мэдээлэл — QPay-аар дамжсан гүйлгээний бүртгэл</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">3. Мэдээллийг ашиглах зорилго</h2>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">Таны аккаунтыг удирдах, хамгаалах</li>
              <li className="list-disc">Платформын үйлчилгээг хангах, сайжруулах</li>
              <li className="list-disc">Төлбөрийн гүйлгээг боловсруулах</li>
              <li className="list-disc">Хэрэглэгчдийн аюулгүй байдлыг хангах</li>
              <li className="list-disc">Хууль эрх зүйн үүргээ биелүүлэх</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">4. Мэдээлэл хуваалцах</h2>
            <p>
              Бид таны хувийн мэдээллийг гуравдагч этгээдэд зарах, худалдаалах, шилжүүлдэггүй болно.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">5. Мэдээллийн аюулгүй байдал</h2>
            <p>
              Таны мэдээллийг хамгаалахын тулд бид шифрлэлт, нэвтрэх хяналт, аюулгүй серверийн дэд бүтэц ашигладаг.
              Гэсэн хэдий ч интернетэд дамжуулах бүрэн аюулгүй байдлыг баталгаажуулах боломжгүй тул
              таны нууц үгийг найдвартай хадгалах хариуцлагыг өөрөө хүлээнэ.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">6. Насны хязгаарлалт</h2>
            <p>
              Khuslen платформ нь зөвхөн <strong className="text-white">18 ба түүнээс дээш насны хүмүүст</strong> зориулагдсан.
              18 насанд хүрээгүй хүн бүртгүүлэх эрхгүй бөгөөд бид ийм хэрэглэгчийн аккаунтыг
              илрүүлсэн тохиолдолд нэн даруй устгах эрхтэй.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">7. Хэрэглэгчийн эрх</h2>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">Өөрийн мэдээллийг харах, шинэчлэх</li>
              <li className="list-disc">Аккаунтаа устгуулахыг хүсэх</li>
              <li className="list-disc">Мэдэгдэл, зар сурталчилгааг цуцлах</li>
            </ul>
            <p className="mt-3">
              Эдгээр эрхтэй холбоотой хүсэлтийг support@khuslen.mn хаягаар илгээнэ үү.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">8. Холбоо барих</h2>
            <p>
              Нууцлалын бодлоготой холбоотой асуулт, санал гомдол байвал{" "}
              <a href="mailto:support@khuslen.mn" className="text-[#e8415a] hover:underline">
                support@khuslen.mn
              </a>{" "}
              хаягаар холбогдоно уу.
            </p>
          </section>

        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/30">
          <span>© 2026 Khuslen. Бүх эрх хуулиар хамгаалагдсан.</span>
          <Link href="/terms" className="text-white/40 hover:text-white/70 transition-colors no-underline">
            Үйлчилгээний нөхцөл →
          </Link>
        </div>

      </div>
    </div>
  );
}

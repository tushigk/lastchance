import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d0a11] text-white">
      <div className="max-w-[760px] mx-auto px-6 py-16">

        {/* Back */}
        <Link href="/register" className="inline-flex items-center gap-2 text-[14px] text-white/40 hover:text-white/70 transition-colors mb-10 no-underline">
          ← Буцах
        </Link>

        <h1 className="text-[32px] font-black mb-2">Үйлчилгээний нөхцөл</h1>
        <p className="text-[14px] text-white/40 mb-12">Сүүлд шинэчилсэн: 2026 оны 5-р сар</p>

        <div className="flex flex-col gap-10 text-[15px] text-white/75 leading-relaxed">

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">1. Үйлчилгээний талаар</h2>
            <p>
              Khuslen нь насанд хүрэгчдэд зориулсан нийгмийн платформ юм. Платформыг ашигласнаар
              та энэхүү үйлчилгээний нөхцөлийг бүрэн хүлээн зөвшөөрч байна гэж үзнэ.
              Нөхцөлийг зөвшөөрөхгүй бол платформыг ашиглахаас татгалзана уу.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">2. Бүртгэлийн шаардлага</h2>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">Та <strong className="text-white">18 ба түүнээс дээш</strong> насны байх ёстой</li>
              <li className="list-disc">Нэг хүн зөвхөн нэг аккаунт үүсгэх боломжтой</li>
              <li className="list-disc">Бүртгэлийн мэдээлэл үнэн зөв байх ёстой</li>
              <li className="list-disc">Нэвтрэх мэдээллээ нууцлах хариуцлагыг өөрөө хүлээнэ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">3. Хориглосон үйлдлүүд</h2>
            <p className="mb-3">Дараах үйлдлүүд хатуу хориглоно:</p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">18 насанд хүрээгүй хүний зураг, контент байршуулах</li>
              <li className="list-disc">Бусад хэрэглэгчийг дарамтлах, гомдоох, заналхийлэх</li>
              <li className="list-disc">Хуурамч мэдээлэл, хуурамч профайл үүсгэх</li>
              <li className="list-disc">Платформын системд халдах, вирус тарааx</li>
              <li className="list-disc">Зар сурталчилгаа, спам мессеж илгээх</li>
              <li className="list-disc">Бусдын зөвшөөрөлгүйгээр агуулгыг хуулж тараах</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">4. Гишүүнчлэл ба төлбөр</h2>
            <p className="mb-3">
              Зарим үйлчилгээ нь төлбөртэй гишүүнчлэл шаарддаг. Төлбөртэй холбоотой нөхцөлүүд:
            </p>
            <ul className="flex flex-col gap-2 pl-5">
              <li className="list-disc">Бүх төлбөр QPay системээр хийгдэнэ</li>
              <li className="list-disc">Гишүүнчлэл идэвхжсэн өдрөөс тооцно</li>
              <li className="list-disc">Төлсөн хугацаа дуусмагц үйлчилгээ автоматаар зогсоно</li>
              <li className="list-disc">Буцааж олгох бодлого: техникийн алдааны тохиолдолд 72 цагийн дотор холбоо барина уу</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">5. Агуулгын эрх</h2>
            <p>
              Та платформд байршуулсан агуулгынхаа эрхийг өөртөө хадгална. Гэсэн хэдий ч
              байршуулснаар та Khuslen-д тухайн агуулгыг платформын хүрээнд үзүүлэх,
              хуваалцах зөвшөөрлийг олгосон гэж үзнэ. Хориотой агуулгыг
              урьдчилан мэдэгдэлгүйгээр устгах эрхийг бид хадгална.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">6. Аккаунт түдгэлзүүлэх</h2>
            <p>
              Дараах тохиолдолд таны аккаунтыг урьдчилан мэдэгдэлгүйгээр түдгэлзүүлэх
              эсвэл бүрмөсөн устгах эрхтэй:
            </p>
            <ul className="flex flex-col gap-2 pl-5 mt-3">
              <li className="list-disc">Үйлчилгээний нөхцөл зөрчсөн</li>
              <li className="list-disc">Бусад хэрэглэгчдэд хохирол учруулсан</li>
              <li className="list-disc">Хуулийн байгууллагын шаардлага гарсан</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">7. Хариуцлагын хязгаарлалт</h2>
            <p>
              Khuslen платформ нь хэрэглэгчдийн хоорондын харилцааны улмаас үүссэн
              аливаа хохирол, маргааны хариуцлагыг хүлээхгүй. Платформ нь зуучлагчийн
              үүрэг гүйцэтгэх бөгөөд хэрэглэгч бүр өөрийн үйлдлийн хариуцлагыг хувиараа хүлээнэ.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">8. Нөхцөл өөрчлөлт</h2>
            <p>
              Бид үйлчилгээний нөхцөлийг цаг үе тутам шинэчилж болно. Томоохон өөрчлөлт гарвал
              платформ дотор мэдэгдэл өгнө. Өөрчлөлтийн дараа платформыг үргэлжлүүлэн
              ашигласнаар та шинэ нөхцөлийг зөвшөөрсөн гэж үзнэ.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-white mb-3">9. Холбоо барих</h2>
            <p>
              Асуулт, гомдол байвал{" "}
              <a href="mailto:support@Khuslen.mn" className="text-[#e8415a] hover:underline">
                support@Khuslen.mn
              </a>{" "}
              хаягаар холбогдоно уу.
            </p>
          </section>

        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/30">
          <span>© 2026 Khuslen. Бүх эрх хуулиар хамгаалагдсан.</span>
          <Link href="/privacy" className="text-white/40 hover:text-white/70 transition-colors no-underline">
            Нууцлалын бодлого →
          </Link>
        </div>

      </div>
    </div>
  );
}

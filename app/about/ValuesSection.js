export default function ValuesSection({ isVisible, primaryBlue, TypingText }) {
  const fixedPrimaryBlue = "#0a1e3a";

  const values = [
    {
      prefix: "Graha: ",
      animatedText: "Inovatif",
      desc: "Selalu mencari cara baru dan lebih baik dalam menjalankan bisnis dan memberikan layanan.",
    },
    {
      prefix: "Graha: ",
      animatedText: "Kompeten",
      desc: "Memiliki tim profesional yang ahli di bidangnya dan terus mengembangkan kapabilitas.",
    },
    {
      prefix: "Graha: ",
      animatedText: "Berintegritas",
      desc: "Menjunjung tinggi kejujuran, tanggung jawab, dan etika dalam setiap keputusan.",
    },
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container px-4">
        <div
          className="text-center mb-5"
          data-idx="5"
          style={{
            opacity: isVisible["5"] ? 1 : 0,
            transform: isVisible["5"] ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s",
          }}
        >
          <h2 className="fw-bold text-dark" style={{ color: fixedPrimaryBlue }}>
            Nilai-Nilai Graha
          </h2>
          <p className="text-muted fs-5">
            Panduan utama dalam pengembangan bisnis dan budaya kerja kami.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {values.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="card border-0 shadow-sm h-100 rounded-3 text-center p-4"
                data-idx={`${6 + index}`}
                style={{
                  opacity: isVisible[`${6 + index}`] ? 1 : 0,
                  transform: isVisible[`${6 + index}`] ? "translateY(0)" : "translateY(30px)",
                  transition: `all 1s cubic-bezier(0.4, 0, 0.2, 1) ${0.7 + index * 0.1}s`,
                }}
              >
                <div className="fs-1 mb-3">🚀</div>
                <TypingText
                  prefix={item.prefix}
                  animatedText={item.animatedText}
                  index={index}
                  isVisible={isVisible[`${6 + index}`]}
                  primaryBlue={fixedPrimaryBlue}
                />
                <p className="text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
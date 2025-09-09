import React from 'react';
import styles from '../css/about.module.css';

export default function About() {
  return (
    <section id="about" className={`${styles.about} section py-5`}>
      <div className="container mb-5" data-aos="fade-up">
        <h2 className="fw-bold">About</h2>
        <p className="text-muted fs-5">
          PT Graha Sarana Gresik – Komitmen kami terhadap mutu, lingkungan, dan keamanan pangan dalam setiap layanan.
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <p>
              PT Graha Sarana Gresik adalah perusahaan yang bergerak di bidang property, pergudangan, dan jasa konstruksi dengan komitmen tinggi terhadap kualitas dan keberlanjutan.
            </p>
            <ul className={styles.ul}>
              <li><i className="bi bi-check2-circle"></i> Menyediakan layanan profesional di berbagai sektor bisnis.</li>
              <li><i className="bi bi-check2-circle"></i> Berkomitmen pada keberlanjutan lingkungan dan kepuasan pelanggan.</li>
              <li><i className="bi bi-check2-circle"></i> Mengedepankan integritas, inovasi, dan kompetensi tim.</li>
            </ul>
          </div>

          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
            <p>
              Dengan sistem manajemen terintegrasi (ISO 9001, ISO 14001, ISO 22000), kami terus berkembang sebagai mitra strategis bagi korporasi dan masyarakat.
            </p>
            <a href="/about" className={styles["read-more"]}>
              <span>Read More</span>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
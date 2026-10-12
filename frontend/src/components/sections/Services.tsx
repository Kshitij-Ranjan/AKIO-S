export function Services() {
  const services = [
    { title: "Offline Editing", desc: "Story assembly, pacing, and narrative structure." },
    { title: "Color Grading", desc: "Cinematic looks and color correction." },
    { title: "Sound Design", desc: "Immersive audioscapes and mixing." },
  ];

  return (
    <section id="services" className="services section">
      <div className="container">
        <h2 className="section__heading">Services</h2>
        <div className="services__grid">
          {services.map((s, i) => (
            <div key={i} className="services__item">
              <h3 className="services__item-title">{s.title}</h3>
              <p className="services__item-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

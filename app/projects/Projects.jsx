import Image from "next/image";

export default function Projects() {
        const projects = [
  {
    id: "01",
    title: "Excellence Kitchen Interior Design",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
    ],
  },
  {
    id: "02",
    title: "Top-notch Living Room Interior",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
    ],
  },
  {
    id: "03",
    title: "Modern Bedroom Interior",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    ],
  },
  {
    id: "04",
    title: "Luxury Office Workspace",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.",
    images: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76",
      "https://images.unsplash.com/photo-1497366216548-37526070297c",
      "https://images.unsplash.com/photo-1594125674956-61c1fef250b4",
    ],
  },
  {
    id: "05",
    title: "Minimal Dining Area",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit.",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457",
      "https://images.unsplash.com/photo-1598300053654-4c1f3f5f7b4c",
    ],
  },
  {
    id: "06",
    title: "Elegant Bathroom Interior",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nemo enim ipsam voluptatem quia voluptas sit.",
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    ],
  },
];
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 space-y-32 overflow-hidden">
      {projects.map((project, index) => {
        const isReverse = index % 2 !== 0;

        return (
          <div
            key={project.id}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* TEXT */}
            <div className={`${isReverse ? "lg:order-2" : "lg:order-1"}`}>
              <span className="text-sm text-gray-400">
                {project.id} — 06
              </span>

              <h2 className="text-3xl md:text-4xl font-semibold mt-3">
                {project.title}
              </h2>

              <p className="text-gray-600 mt-4 max-w-md">
                {project.desc}
              </p>

              <button className="mt-6 inline-flex items-center gap-2 border border-black rounded-full px-6 py-2 text-sm hover:bg-black hover:text-white transition">
                View Project →
              </button>
            </div>

            {/* IMAGES */}
            <div className={`${isReverse ? "lg:order-1" : "lg:order-2"}`}>
              <div className="flex flex-col sm:flex-row gap-4 max-w-full">
                
                {/* Small image */}
                {/* <div className="w-full sm:w-1/3">
                  <Image
                    src={project.images[1]}
                    alt=""
                    width={400}
                    height={300}
                    className="rounded-xl object-cover w-full h-auto"
                  />
                </div> */}

                {/* Main image */}
                <div className="w-full ">
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    width={800}
                    height={500}
                    className="rounded-xl object-cover w-full h-auto"
                  />
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

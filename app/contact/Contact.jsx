"use client";

export default function Contact() {
  return (
    <section className=" py-16 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        
        {/* LEFT INFO CARD */}
        <div className="bg-[#f3f1ec] rounded-xl p-8 lg:p-10">
          <h2 className="text-3xl font-semibold mb-4">
            Get in Touch with <br /> Siddhant Dhariwal Designs
          </h2>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Have a question, need support with your order, or wish to learn
            more about our collections? We’d love to hear from you — our team
            is here to help.
          </p>

          <div className="mb-6">
            <h4 className="font-medium mb-1">Reach us on email:</h4>
            <p className="text-sm text-gray-700">letsdesignsid23@gmail.com</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Phone:</h4>

            <p className="text-sm text-gray-700 mb-1">
              Mumbai: +91 8128202359
            </p>

            {/* <p className="text-sm text-gray-700 mb-1">
              Bangalore: +91 72089 71366
            </p>

            <p className="text-sm text-gray-700">
              Gurgaon: +91 77382 49492
            </p> */}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white rounded-xl p-8 lg:p-10 shadow-sm">
          <form className="space-y-5">
            
            {/* NAME ROW */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* CONTACT ROW */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Your Phone No.</label>
                <input
                  type="tel"
                  placeholder="Enter your phone no."
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  placeholder="itsanexample@gmail.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                rows="4"
                placeholder="Share your query or feedback..."
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="bg-[#3b3b3b] text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-black transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

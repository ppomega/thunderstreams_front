import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  X,
  TwitterIcon,
} from "lucide-react";

const ContactUs = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-bubble2 rounded-2xl shadow-lg text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>

      {/* Contact Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="text-pink-500" />
          <p>
            Email:{" "}
            <a
              href="mailto:contact@example.com"
              className="text-pink-600 hover:underline"
            >
              prateekveerbhan@gmail.com
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-green-500" />
          <p>
            Phone:{" "}
            <a
              href="tel:+1234567890"
              className="text-green-600 hover:underline"
            >
              +1 234 567 890
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-red-500" />
          <p>123 Faridabad, HY</p>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-6 flex justify-center space-x-6">
        <a href="#" className="text-pink-600 hover:text-pink-800">
          <Instagram />
        </a>
        <a href="#" className="text-pink-400 hover:text-pink-600">
          <TwitterIcon />
        </a>
        <a href="#" className="text-pink-700 hover:text-pink-900">
          <Linkedin />
        </a>
      </div>
      <div className="font-[Origin-Tech] text-6xl py-3"> Thunder Streams</div>
    </div>
  );
};

export default ContactUs;

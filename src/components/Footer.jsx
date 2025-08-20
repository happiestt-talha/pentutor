import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary/80 to-primary/95 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {/* <h3 className="text-2xl font-bold text-yellow-500">Pen Tutor</h3> */}
            {/* Replace your Image block with this */}
            <div className="relative w-40 h-20 md:w-56 md:h-20">
              <Image
                src="/logo.png"
                alt="Pen Tutor Logo"
                fill
                className="object-contain w-full h-full rounded-lg"
              />
            </div>

            <p className="text-gray-300 leading-relaxed">
              Connecting students with qualified tutors for personalized learning experiences.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/our-tutors" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  Find a Tutor
                </Link>
              </li>
              <li>
                <Link href="/profile?form=tutor" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-300">info@pentutor.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-300">+92 300 1118187</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-yellow-500" />
                <span className="text-gray-300">Johar Town, Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-300 text-sm">Subscribe to get updates on new tutors and features.</p>
            <div className="space-y-2">
              <Input
                placeholder="Enter your email"
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
              />
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pen Tutor. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}

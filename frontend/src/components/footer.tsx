"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Share, Heart, Users, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, #f97316 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 transform hover:translate-y-1 transition-transform duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                PadosHelp
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              India's leading hyperlocal community platform connecting neighbors 
              to share services, information, and build stronger communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6" title="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:-rotate-6" title="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6" title="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:-rotate-6" title="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-all duration-300 transform hover:scale-110 hover:rotate-6" title="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 transform hover:translate-y-1 transition-transform duration-300">
            <h4 className="text-lg font-semibold flex items-center">
              <Share className="h-5 w-5 text-orange-500 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Local Alerts
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/water" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Water Schedule
                </Link>
              </li>
              <li>
                <Link href="/parking" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Parking
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6 transform hover:translate-y-1 transition-transform duration-300">
            <h4 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 text-orange-500 mr-2" />
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/lost-found" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Lost & Found
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Skill Exchange
                </Link>
              </li>
              <li>
                <Link href="/power" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Power Updates
                </Link>
              </li>
              <li>
                <Link href="/queue" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Queue Updates
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 transform hover:translate-y-1 transition-transform duration-300">
            <h4 className="text-lg font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 text-orange-500 mr-2" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Phone className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors">+91 8080808080</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Mail className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors">support@PadosHelp.app</span>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors mt-1">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-gray-300 text-sm group-hover:text-orange-400 transition-colors">
                  123 Community Center, Kolkata, West Bengal 700001
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Link 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-gray-400 text-sm flex items-center space-x-2">
              <Heart className="h-4 w-4 text-orange-500" />
              <span>© 2024 PadosHelp. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 inline-flex items-center group">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 inline-flex items-center group">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Terms of Service
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-105 inline-flex items-center group">
                <span className="w-1 h-1 bg-orange-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
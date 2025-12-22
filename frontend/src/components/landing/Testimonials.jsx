import React, { useState, useEffect } from 'react';
import Container from '../ui/Container';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Hussain Naqvi",
            course: "Quantitative Finance Bootcamp",
            quote: "My journey with the Quantitative Finance & Business Analytics Bootcamp 2025 by Combine Foundation has been very rewarding. In the very first session, I was able to build a Financial Calculator (NPV & IRR) in Python on Google Colab, which calculates values and provides investment recommendations. The hands-on approach makes learning both practical and impactful. I'm excited to continue exploring upcoming topics like Risk, Derivatives, and Portfolio Optimization."
        },
        {
            name: "Rahib Khan",
            course: "Basic Computer fundamental with AI",
            quote: "Assalamu Alaikum Sir, You taught and guided us in an excellent way, patiently clearing all our doubts and helping us fully understand each concept. You explained everything from the basics to advanced topics, and also showed us how to explore further in the field. You provided us with a clear pathway for learning, which I will never forget in my life. Thank you so much for this opportunity and for helping me evolve my IT skills in the world of computers."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden text-white">
            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <Container className="relative z-10">
                <div className="text-center mb-16">
                    <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-3 block">Community Voices</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                        Success Stories
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Hear from our students and community members about their transformative experiences.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-orange-500 transition-all focus:outline-none border border-white/10 hidden md:block"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-orange-500 transition-all focus:outline-none border border-white/10 hidden md:block"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>

                    <div className="overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 shadow-2xl">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="min-w-full flex flex-col md:flex-row gap-8 items-center px-4">
                                    {/* Quote Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-4xl font-serif shadow-lg shadow-orange-500/30">
                                            "
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow text-center md:text-left relative z-10">
                                        <p className="text-lg md:text-2xl text-gray-200 italic leading-relaxed mb-8 font-light">
                                            "{testimonial.quote}"
                                        </p>

                                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1 tracking-wide">{testimonial.name}</h4>
                                                <p className="text-orange-400 font-medium text-sm uppercase tracking-wider">{testimonial.course}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Small indicator for mobile mostly - moved outside the flex track relative to parent */}
                        <div className="flex justify-center md:justify-end gap-2 mt-6">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 w-8' : 'bg-gray-600 w-2 hover:bg-gray-500'}`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Testimonials;

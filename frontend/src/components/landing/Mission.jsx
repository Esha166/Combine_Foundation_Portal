import React, { useState, useEffect, useRef } from 'react';
import Container from '../ui/Container';

const Mission = () => {
    const values = [
        {
            title: "Youth Empowerment",
            description: "Encouraging young people to take initiative, build confidence, and become leaders in their communities."
        },
        {
            title: "Integrity & Accountability",
            description: "Acting with honesty, transparency, and responsibility in all programs and initiatives."
        },
        {
            title: "Community Service",
            description: "Promoting volunteerism and active participation in social, educational, and health-related projects."
        },
        {
            title: "Collaboration & Teamwork",
            description: "Fostering partnerships between students, mentors, volunteers, and communities to achieve common goals."
        },
        {
            title: "Innovation & Learning",
            description: "Encouraging creativity, problem-solving, and continuous learning through practical experiences in YLP and other programs."
        },
        {
            title: "Inclusivity & Equality",
            description: "Ensuring all programs are accessible and promote fairness, respect, and equal opportunities for every participant."
        },
        {
            title: "Sustainability & Social Impact",
            description: "Creating initiatives that lead to long-term positive change in communities."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const carouselRef = useRef(null);

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            // Loop back to start if we reach the end
            // The logic here handles the standard carousel loop
            return prevIndex === values.length - itemsPerPage ? 0 : prevIndex + 1;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            // Loop to end if we are at start
            return prevIndex === 0 ? values.length - itemsPerPage : prevIndex - 1;
        });
    };

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [itemsPerPage]); // Reset if itemsPerPage changes

    return (
        <section className="py-24 bg-white overflow-hidden">
            <Container>
                {/* Introduction Section - Redesigned */}
                <div className="max-w-5xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            Introduction of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Combine Foundation</span>
                        </h2>
                    </div>
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                        <p className="relative text-xl md:text-2xl text-gray-700 leading-relaxed text-center font-light">
                            Combine Foundation is a non-profit organization working to improve access to <span className="font-semibold text-gray-900">healthcare</span> and <span className="font-semibold text-gray-900">education</span> for underserved communities in Pakistan. We provide medical help, scholarships, relief support, and awareness activities, helping people build better futures and stronger, sustainable communities.
                        </p>
                    </div>
                </div>

                {/* Vision Section - Redesigned with Quote Marks */}
                <div className="max-w-5xl mx-auto mb-24">
                    <div className="relative bg-gradient-to-br from-orange-50 to-white rounded-3xl p-10 md:p-16 shadow-lg border border-orange-100">
                        {/* Large Start Quote */}
                        <svg className="absolute top-8 left-8 w-16 h-16 md:w-24 md:h-24 text-orange-200 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.55228 16 10 15.5523 10 15V9C10 8.44772 9.55228 8 9 8H5C4.44772 8 4 8.44772 4 9V18C4 19.6569 5.34315 21 7 21H14.017ZM24.017 21L24.017 18C24.017 16.8954 23.1216 16 22.017 16H19C19.5523 16 20 15.5523 20 15V9C20 8.44772 19.5523 8 19 8H15C14.44772 8 14 8.44772 14 9V18C14 19.6569 15.3431 21 17 21H24.017Z" />
                        </svg>

                        <div className="relative z-10 text-center">
                            <h3 className="2xl font-bold text-orange-600 mb-6 uppercase tracking-widest">Our Vision</h3>
                            <p className="text-2xl md:text-3xl text-gray-800 font-serif italic leading-relaxed">
                                To empower youth as responsible, confident, and socially-aware leaders who drive positive change,
                                inspire others, promote community development, advocate for education and health awareness, and
                                contribute to a more equitable and sustainable society.
                            </p>
                        </div>

                        {/* Large End Quote */}
                        <svg className="absolute bottom-8 right-8 w-16 h-16 md:w-24 md:h-24 text-orange-200 transform translate-x-1/2 translate-y-1/2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.983 3L9.983 6C9.983 7.10457 10.8784 8 11.983 8H15C14.4477 8 14 8.44772 14 9V15C14 15.5523 14.4477 16 15 16H19C19.5523 16 20 15.5523 20 15V6C20 4.34315 18.6569 3 17 3H9.983ZM-0.0169992 3L-0.0169992 6C-0.0169992 7.10457 0.878428 8 1.983 8H5C4.44772 8 4 8.44772 4 9V15C4 15.5523 4.44772 16 5 16H9C9.5523 16 10 15.5523 10 15V6C10 4.34315 8.65685 3 7 3H-0.0169992Z" />
                        </svg>
                    </div>
                </div>

                {/* Core Values Carousel - Redesigned */}
                <div className="mb-12 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Core Values</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full mb-8"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        The fundamental principles that guide every action we take and shape the impact we create.
                    </p>
                </div>

                <div className="relative group max-w-6xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-8 z-20 p-3 rounded-full bg-white shadow-xl text-orange-600 hover:bg-orange-50 hover:scale-110 transition-all focus:outline-none border border-gray-100"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:-translate-x-8 z-20 p-3 rounded-full bg-white shadow-xl text-orange-600 hover:bg-orange-50 hover:scale-110 transition-all focus:outline-none border border-gray-100"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>

                    {/* Carousel Track */}
                    <div className="overflow-hidden py-10" ref={carouselRef}>
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 px-4"
                                    style={{ width: `${100 / itemsPerPage}%` }}
                                >
                                    <div className="h-full bg-white rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group/card">
                                        {/* Top Accent Gradient */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-500 transform origin-left scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500"></div>

                                        {/* Icon Background Blob */}
                                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-50 rounded-full opacity-50 group-hover/card:scale-110 transition-transform duration-500"></div>

                                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                                            <div className="mb-6 p-4 rounded-full bg-orange-50 text-orange-600 group-hover/card:bg-orange-100 group-hover/card:text-orange-700 transition-colors duration-300">
                                                {/* Dynamic Icon based on index or title could go here, for now using a generic decorative dot or star */}
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            </div>

                                            <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover/card:text-orange-600 transition-colors duration-300">{value.title}</h4>
                                            <p className="text-gray-600 leading-relaxed flex-grow">{value.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Dots Indicator */}
                    <div className="flex justify-center mt-4 gap-3">
                        {Array.from({ length: values.length - itemsPerPage + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2.5 bg-orange-600' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default Mission;

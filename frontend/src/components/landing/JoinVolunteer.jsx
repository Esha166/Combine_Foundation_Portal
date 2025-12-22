import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import Container from '../ui/Container';

const JoinVolunteer = () => {
    const [counts, setCounts] = useState({ active: 0, completed: 0 });

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await volunteerService.getVolunteerCount();
                if (response.success && response.data) {
                    setCounts({
                        active: response.data.active || 0,
                        completed: response.data.completed || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching volunteer count:', error);
            }
        };
        fetchCount();
    }, []);

    return (
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <Container className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Join Us as a Volunteer
                </h2>
                <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto">
                    Become a part of Combine Foundation and make a real difference! As a volunteer, you'll have
                    the chance to participate in community projects, campus events, health campaigns, and
                    youth programs all while developing your skills and leadership abilities.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center max-w-4xl mx-auto mb-12">
                    {/* Active Volunteers */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex-1 border border-white/20 transform hover:scale-105 transition-all duration-300">
                        <div className="text-5xl font-extrabold text-white mb-2">
                            {counts.active > 0 ? (
                                <span>{counts.active}+</span>
                            ) : (
                                <span>100+</span>
                            )}
                        </div>
                        <div className="text-orange-100 font-medium text-lg">Active Volunteers Making an Impact</div>
                    </div>

                    {/* Internship Completed */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex-1 border border-white/20 transform hover:scale-105 transition-all duration-300">
                        <div className="text-5xl font-extrabold text-white mb-2">
                            {counts.completed > 0 ? (
                                <span>{counts.completed}+</span>
                            ) : (
                                <span>50+</span>
                            )}
                        </div>
                        <div className="text-orange-100 font-medium text-lg">Internships Completed Successfully</div>
                    </div>
                </div>

                <Link
                    to="/volunteer/apply"
                    className="inline-flex items-center px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Join Us Today
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </Container>
        </section>
    );
};

export default JoinVolunteer;

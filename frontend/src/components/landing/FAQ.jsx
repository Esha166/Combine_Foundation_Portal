import React, { useState } from 'react';
import Container from '../ui/Container';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-orange-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-gray-900 pr-8">{question}</span>
        <span className="text-orange-600">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out px-6 ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-700 leading-relaxed border-t border-orange-200 pt-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Combine Foundation offer?",
      answer: "We offer youth leadership programs, skills training, mentorship, campus activities, community projects, and personal development support."
    },
    {
      question: "How can I join Combine Foundation programs?",
      answer: "Simply fill out the registration form and our team will contact you with the next steps."
    },
    {
      question: "Who can apply for the leadership program?",
      answer: "University students who are passionate, motivated, and willing to grow are welcome to apply."
    },
    {
      question: "Is there any fee to join the program?",
      answer: "No, the program is free. Our goal is to support youth development and opportunities without financial barriers."
    },
    {
      question: "What skills will I learn through this program?",
      answer: "You will develop communication, leadership, teamwork, planning, problem-solving, public speaking, and personal growth skills."
    },
    {
      question: "How long is the program?",
      answer: "Program duration depends on selected activities and training cycles, typically ranging from 6 months."
    },
    {
      question: "Will I receive a certificate after completing the program?",
      answer: "Yes. Participants who complete the required tasks and meet the program criteria will receive a completion certificate."
    },
    {
      question: "Can I volunteer with Combine Foundation?",
      answer: "Yes! Students can apply for volunteer roles, campus responsibilities, and event participation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our programs and mission.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;

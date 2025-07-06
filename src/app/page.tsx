'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState, useEffect, FormEvent } from 'react';
import { Sparkles, Loader2, Quote as QuoteIcon } from 'lucide-react'; // Icons for visual appeal

// --- Mock Quote Data ---
// In a real application, this might come from an API or a database.
// Added 'tags' for basic topic filtering.
interface Quote {
  id: string;
  text: string;
  author: string;
  tags: string[];
}

const allQuotes: Quote[] = [
  { id: '1', text: "The only way to do great work is to love what you do.", author: "Steve Jobs", tags: ["work", "inspiration", "passion"] },
  { id: '2', text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", tags: ["innovation", "leadership"] },
  { id: '3', text: "Life is what happens when you're busy making other plans.", author: "John Lennon", tags: ["life", "planning"] },
  { id: '4', text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", tags: ["future", "dreams", "inspiration"] },
  { id: '5', text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", tags: ["success", "value", "life"] },
  { id: '6', text: "The best way to predict the future is to create it.", author: "Peter Drucker", tags: ["future", "action", "creation"] },
  { id: '7', text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", tags: ["belief", "motivation"] },
  { id: '8', text: "The mind is everything. What you think you become.", author: "Buddha", tags: ["mind", "thought", "spirituality"] },
  { id: '9', text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein", tags: ["humor", "philosophy"] },
  { id: '10', text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", tags: ["wisdom", "philosophy"] },
  { id: '11', text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", tags: ["darkness", "light", "hope"] },
  { id: '12', text: "The unexamined life is not worth living.", author: "Socrates", tags: ["life", "philosophy"] },
  { id: '13', text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", tags: ["action", "opportunity", "sports"] },
  { id: '14', text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", tags: ["journey", "beginning", "perseverance"] },
  { id: '15', text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", tags: ["strength", "adversity"] },
  { id: '16', text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", tags: ["journey", "motivation"] },
  { id: '17', text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", tags: ["success", "failure", "courage"] },
  { id: '18', text: "The purpose of our lives is to be happy.", author: "Dalai Lama", tags: ["purpose", "happiness"] },
  { id: '19', text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost", tags: ["life", "resilience"] },
  { id: '20', text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton", tags: ["mind", "perception"] },
];

// --- Helper function to get random unique quotes ---
const getRandomQuotes = (count: number, excludeIds: Set<string> = new Set()): Quote[] => {
  const availableQuotes = allQuotes.filter(q => !excludeIds.has(q.id));
  if (availableQuotes.length === 0) return [];

  const shuffled = [...availableQuotes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// --- Main Page Component ---
export default function QuoteGeneratorPage() {
  const [topic, setTopic] = useState<string>('');
  const [generatedQuotes, setGeneratedQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to generate quotes based on topic
  const generateQuotes = (selectedTopic: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedQuotes([]); // Clear previous quotes

    // Simulate API call delay
    setTimeout(() => {
      let filteredQuotes: Quote[] = [];
      if (selectedTopic) {
        const lowerCaseTopic = selectedTopic.toLowerCase();
        filteredQuotes = allQuotes.filter(quote =>
          quote.tags.some(tag => tag.toLowerCase().includes(lowerCaseTopic)) ||
          quote.text.toLowerCase().includes(lowerCaseTopic) ||
          quote.author.toLowerCase().includes(lowerCaseTopic)
        );
      }

      let finalQuotes: Quote[] = [];
      const selectedQuoteIds = new Set<string>();

      // Prioritize filtered quotes
      for (let i = 0; i < Math.min(3, filteredQuotes.length); i++) {
        finalQuotes.push(filteredQuotes[i]);
        selectedQuoteIds.add(filteredQuotes[i].id);
      }

      // Fill up to 3 quotes with random ones if not enough filtered quotes
      if (finalQuotes.length < 3) {
        const randomRemaining = getRandomQuotes(3 - finalQuotes.length, selectedQuoteIds);
        finalQuotes = [...finalQuotes, ...randomRemaining];
      }

      if (finalQuotes.length === 0) {
        setError("No quotes found for this topic. Try a different one or generate random quotes!");
      } else {
        setGeneratedQuotes(finalQuotes);
      }
      setIsLoading(false);
    }, 1000); // 1 second delay
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    generateQuotes(topic);
  };

  // Generate initial quotes on component mount
  useEffect(() => {
    generateQuotes(''); // Generate random quotes initially
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border border-gray-100">
        {/* Header Section */}
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Inspire <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">Me</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Generate powerful quotes on any topic.
          </p>
        </div>

        {/* ShadCN-like Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter a topic (e.g., 'life', 'work', 'dreams')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                       outline-none transition-all duration-200 text-lg placeholder-gray-500 shadow-sm
                       hover:border-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                       text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300
                       hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Quotes
          </button>
        </form>

        {/* Quote Display Section */}
        <div className="min-h-[250px] flex flex-col justify-center items-center">
          {isLoading && (
            <div className="flex flex-col items-center text-indigo-600">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-xl font-medium">Generating wisdom...</p>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-lg">{error}</p>
            </div>
          )}

          {!isLoading && !error && generatedQuotes.length > 0 && (
            <div className="grid grid-cols-1 gap-6 w-full">
              {generatedQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100
                             hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1"
                >
                  <QuoteIcon className="w-8 h-8 text-indigo-500 mb-3 opacity-70" />
                  {/* FIX: Replaced literal " with &quot; */}
                  <p className="text-xl md:text-2xl font-semibold italic mb-3 leading-relaxed text-gray-800">
                    &quot;{quote.text}&quot;
                  </p>
                  <p className="text-lg text-right text-gray-600 font-medium">- {quote.author}</p>
                  {quote.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 justify-end">
                      {quote.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

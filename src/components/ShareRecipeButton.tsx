import React, { useState } from 'react';
import { Meal } from "@/services/mealdb";

interface ShareRecipeProps {
  recipe?: Meal;
  className?: string;
  iconSize?: number;
}

const ShareRecipeButton: React.FC<ShareRecipeProps> = ({
  recipe,
  className = '',
  iconSize = 20
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Early return with just the button if recipe is undefined
  if (!recipe) {
    return (
      <button 
        className={`text-gray-400 cursor-not-allowed ${className}`}
        disabled
        aria-label="Share recipe (unavailable)"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    );
  }
  
  // Safely access recipe properties with fallbacks
  const recipeUrl = window.location.href;
  const recipeTitle = recipe.strMeal || 'Recipe';
  const recipeCategory = recipe.strCategory || 'Food';
  const recipeArea = recipe.strArea || 'International';
  
  // Prepare content for sharing
  const shareTitle = `Check out this ${recipeArea} ${recipeCategory} recipe: ${recipeTitle}`;
  const shareDescription = `I found this delicious recipe for ${recipeTitle}. It's a ${recipeArea} ${recipeCategory} dish!`;
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(recipeUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedDescription = encodeURIComponent(shareDescription);
  
  // Generate hashtags based on recipe
  const generateHashtags = () => {
    const tags = ['recipe', 'cooking'];
    if (recipeCategory) tags.push(recipeCategory.toLowerCase().replace(/\s+/g, ''));
    if (recipeArea) tags.push(recipeArea.toLowerCase().replace(/\s+/g, ''));
    return tags.join(',');
  };
  
  const hashtags = generateHashtags();
  
  // Share URLs for different platforms
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags}`;
  
  // Function to handle opening share links
  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };
  
  // Function for Instagram (will try to open the app)
  const handleInstagramShare = () => {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = 'instagram://';
    } else {
      alert('Instagram sharing is only available on mobile devices with the Instagram app installed');
    }
    setIsOpen(false);
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Share recipe"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10 right-0">
          <ul className="py-1">

            <li>
              <button
                onClick={() => handleShare(twitterShareUrl)}
                className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
              >
                <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
                Twitter
              </button>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default ShareRecipeButton;
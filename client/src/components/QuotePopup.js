import React from "react";

const QuotePopup = ({ quote, onAnimationEnd }) => {
  if (!quote) return null;

  return (
    <div className="quote-popup" onAnimationEnd={onAnimationEnd}>
      {quote}
    </div>
  );
};

export default QuotePopup;

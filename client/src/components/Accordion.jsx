import React, { useState } from 'react';
import '../styles/Accordion.scss';

const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const togglePanel = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {[
        { title: 'Section 1', content: 'This is the content for section 1.' },
        { title: 'Section 2', content: 'Here is some different content for section 2.' },
        { title: 'Section 3', content: 'Finally, this is the content for section 3.' },
        { title: 'Section 4', content: 'This is the content for section 1.' },
        { title: 'Section 5', content: 'Here is some different content for section 2.' },
        { title: 'Section 6', content: 'Finally, this is the content for section 3.' },
        { title: 'Section 7', content: 'This is the content for section 1.' },
        { title: 'Section 8', content: 'Here is some different content for section 2.' },
        { title: 'Section 9', content: 'Finally, this is the content for section 3.' }
      ].map((section, index) => (
        <div key={index}>
          <button
            className={`accordion ${activeIndex === index ? 'active' : ''}`}
            onClick={() => togglePanel(index)}
          >
            {section.title}
          </button>
          <div className="panel" style={{ display: activeIndex === index ? 'block' : 'none' }}>
            <p>{section.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;

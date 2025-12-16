import React from 'react';

const DiffView: React.FC<{ html: string }> = ({ html }) => {
    return (
        <div
            className="diff-text"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default DiffView;

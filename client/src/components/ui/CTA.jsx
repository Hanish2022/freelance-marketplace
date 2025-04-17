import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const CTA = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonAction,
  primaryButtonIcon,
  secondaryButtonIcon,
  className = "",
  ...props
}) => {
  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl ${className}`} {...props}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && <p className="text-xl text-gray-300 mb-8">{subtitle}</p>}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButtonText && (
            <Button
              variant="primary"
              size="lg"
              onClick={primaryButtonAction}
              icon={primaryButtonIcon}
              className="min-w-[200px]"
            >
              {primaryButtonText}
            </Button>
          )}
          
          {secondaryButtonText && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryButtonAction}
              icon={secondaryButtonIcon}
              className="min-w-[200px]"
            >
              {secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

CTA.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryButtonText: PropTypes.string,
  primaryButtonAction: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  secondaryButtonAction: PropTypes.func,
  primaryButtonIcon: PropTypes.node,
  secondaryButtonIcon: PropTypes.node,
  className: PropTypes.string,
};

export default CTA; 
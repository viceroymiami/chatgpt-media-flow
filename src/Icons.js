import React from 'react';

// Font Awesome icon component wrapper
const Icon = ({ icon, size = 16, className = "" }) => (
  <i 
    className={`fas ${icon} ${className}`}
    style={{ fontSize: `${size}px` }}
  />
);

// Individual icon components mapped to Font Awesome
export const X = (props) => (
  <Icon icon="fa-times" {...props} />
);

export const Trash = (props) => (
  <Icon icon="fa-trash" {...props} />
);

export const Palette = (props) => (
  <Icon icon="fa-palette" {...props} />
);

export const FolderOpen = (props) => (
  <Icon icon="fa-folder-open" {...props} />
);

export const Lightning = (props) => (
  <Icon icon="fa-bolt" {...props} />
);

export const Check = (props) => (
  <Icon icon="fa-check" {...props} />
);

export const Circle = (props) => (
  <Icon icon="fa-circle" {...props} />
);

export const Copy = (props) => (
  <Icon icon="fa-copy" {...props} />
);

export const Pencil = (props) => (
  <Icon icon="fa-pencil-alt" {...props} />
);

export const Image = (props) => (
  <Icon icon="fa-image" {...props} />
);

export const Robot = (props) => (
  <Icon icon="fa-robot" {...props} />
);

export const Play = (props) => (
  <Icon icon="fa-play" {...props} />
);

export const ClockClockwise = (props) => (
  <Icon icon="fa-history" {...props} />
);

export const CaretDown = (props) => (
  <Icon icon="fa-caret-down" {...props} />
);

export const MagnifyingGlass = (props) => (
  <Icon icon="fa-search" {...props} />
);

export const Download = (props) => (
  <Icon icon="fa-download" {...props} />
);

export const Upload = (props) => (
  <Icon icon="fa-upload" {...props} />
);

export const FilmReel = (props) => (
  <Icon icon="fa-film" {...props} />
);

export const Camera = (props) => (
  <Icon icon="fa-camera" {...props} />
);

export const CreditCard = (props) => (
  <Icon icon="fa-credit-card" {...props} />
);

export const Lock = (props) => (
  <Icon icon="fa-lock" {...props} />
);

export const Wifi = (props) => (
  <Icon icon="fa-wifi" {...props} />
);

export const ExclamationTriangle = (props) => (
  <Icon icon="fa-exclamation-triangle" {...props} />
);

export const CheckCircle = (props) => (
  <Icon icon="fa-check-circle" {...props} />
);

export const Lightbulb = (props) => (
  <Icon icon="fa-lightbulb" {...props} />
);

export const Box = (props) => (
  <Icon icon="fa-box" {...props} />
);

export const Brain = (props) => (
  <Icon icon="fa-brain" {...props} />
);

export const DrawPolygon = (props) => (
  <Icon icon="fa-draw-polygon" {...props} />
);

export const Template = (props) => (
  <Icon icon="fa-th-large" {...props} />
);

export const FileText = (props) => (
  <Icon icon="fa-file-alt" {...props} />
);

export const Microphone = (props) => (
  <Icon icon="fa-microphone" {...props} />
);

export const GripVertical = (props) => (
  <Icon icon="fa-grip-vertical" {...props} />
);
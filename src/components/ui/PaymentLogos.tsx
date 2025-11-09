// Bank Card Logos
export const VisaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762718881501.png" 
    alt="Visa" 
    className={className}
    onError={(e) => {
      console.error('Failed to load Visa logo');
      e.currentTarget.style.backgroundColor = '#1A1F71';
    }} 
  />
);

export const HDFCLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719561297.png" 
    alt="HDFC" 
    className={className}
    onError={(e) => {
      console.error('Failed to load HDFC logo');
      e.currentTarget.style.backgroundColor = '#004C8F';
    }} 
  />
);

export const RuPayLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719354198.png" 
    alt="RuPay" 
    className={className}
    onError={(e) => {
      console.error('Failed to load RuPay logo');
      e.currentTarget.style.backgroundColor = '#F47216';
    }} 
  />
);

export const SBILogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719520769.png" 
    alt="SBI" 
    className={className}
    onError={(e) => {
      console.error('Failed to load SBI logo');
      e.currentTarget.style.backgroundColor = '#00A0E3';
    }} 
  />
);

// UPI App Logos
export const GooglePayLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719371254.png" 
    alt="Google Pay" 
    className={className}
    onError={(e) => {
      console.error('Failed to load Google Pay logo');
      e.currentTarget.style.backgroundColor = '#4285F4';
    }} 
  />
);

export const PaytmLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719595402.png" 
    alt="Paytm" 
    className={className}
    onError={(e) => {
      console.error('Failed to load Paytm logo');
      e.currentTarget.style.backgroundColor = '#00B9F1';
    }} 
  />
);

export const PhonePeLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img 
    src="/image-1762719608719.png" 
    alt="PhonePe" 
    className={className}
    onError={(e) => {
      console.error('Failed to load PhonePe logo');
      e.currentTarget.style.backgroundColor = '#5F259F';
    }} 
  />
);
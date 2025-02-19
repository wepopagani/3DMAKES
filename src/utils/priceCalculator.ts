interface PriceFactors {
  material: string;
  quality: string;
  volume: number;      // in cm³
  quantity: number;
}

// Material costs per kg in CHF
const MATERIALS = {
  pla: {
    price: 35,
    density: 1.24  // g/cm³
  },
  petg: {
    price: 40,
    density: 1.27
  },
  abs: {
    price: 38,
    density: 1.04
  }
};

// Print quality settings
const QUALITY_SETTINGS = {
  draft: {
    layerHeight: 0.3,    // mm
    printSpeed: 60,      // mm/s
    hourlyRate: 20      // CHF/hour
  },
  standard: {
    layerHeight: 0.2,
    printSpeed: 50,
    hourlyRate: 25
  },
  high: {
    layerHeight: 0.1,
    printSpeed: 40,
    hourlyRate: 30
  }
};

export interface PriceCalculation {
  totalPrice: number;
  details: {
    printTimeHours: number;
    layerHeight: number;
  };
}

function calculatePrintTime(volume: number, quality: string): number {
  const settings = QUALITY_SETTINGS[quality as keyof typeof QUALITY_SETTINGS];
  
  // Convert volume to mm³
  const volumeInMm = volume * 1000;
  
  // Calculate approximate filament length (1.75mm filament)
  const filamentLength = volumeInMm / (Math.PI * Math.pow(1.75/2, 2));
  
  // Calculate basic print time
  let printTime = filamentLength / settings.printSpeed;
  
  // Add 20% for travel moves
  printTime *= 1.2;
  
  // Convert to hours
  return printTime / 3600;
}

export function calculatePrice({
  material,
  quality,
  volume,
  quantity
}: PriceFactors): PriceCalculation {
  const materialInfo = MATERIALS[material as keyof typeof MATERIALS];
  const qualitySettings = QUALITY_SETTINGS[quality as keyof typeof QUALITY_SETTINGS];

  // Calculate material weight (in grams)
  const weightGrams = volume * materialInfo.density;
  
  // Calculate material cost
  const materialCost = (weightGrams / 1000) * materialInfo.price;
  
  // Calculate print time
  const printTimeHours = calculatePrintTime(volume, quality);
  
  // Calculate printing cost based on machine time
  const printingCost = printTimeHours * qualitySettings.hourlyRate;
  
  // Calculate total price
  let totalPrice = (materialCost + printingCost) * quantity;
  
  // Apply bulk discount
  if (quantity >= 10) {
    totalPrice *= 0.9;  // 10% discount for 10+ pieces
  }
  
  // Minimum price
  totalPrice = Math.max(totalPrice, 15);  // Minimum price of 15 CHF

  return {
    totalPrice: Math.ceil(totalPrice * 100) / 100,
    details: {
      printTimeHours: Math.round(printTimeHours * 10) / 10,
      layerHeight: qualitySettings.layerHeight
    }
  };
}
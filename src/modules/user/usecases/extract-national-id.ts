import axios from "axios";

export interface ExtractNationalIDInput {
  front_base64: string;
  back_base64: string;
}

export interface ExtractNationalIDOutput {
  success: boolean;
  data?: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    address: string;
    profession: string;
    marital_status: string;
  };
  message: string;
}

export class ExtractNationalIDUseCase {
  constructor() {}

  async execute(input: ExtractNationalIDInput): Promise<ExtractNationalIDOutput> {
    try {
      // Call OCR API
      const ocrResponse = await axios.post("http://20.174.97.58/ocr/national-id", {
        front_base64: input.front_base64,
        back_base64: input.back_base64
      });

      // Parse the OCR response string into structured data
      const parsedData = this.parseOCRResponse(ocrResponse.data);

      return {
        success: true,
        data: parsedData,
        message: "National ID data extracted successfully"
      };

    } catch (error) {
      console.error("OCR extraction error:", error);
      return {
        success: false,
        message: "Failed to extract ID data from images"
      };
    }
  }

  private parseOCRResponse(ocrData: string): ExtractNationalIDOutput['data'] {
    try {
      console.log("Raw OCR data:", ocrData); // Debug log
      
      // The OCR API returns data as a string like:
      // "full_name='Mostafa Mohamed Salah El-Sayed Mohamed El-Badrawi' date_of_birth='20-01-2005' gender='Male' address='415 Madinet El-Mostaqbal, Al-Shorouk, Cairo' profession='Student' marital_status='Single'"
      
      const result: any = {};
      
      // More robust parsing approach
      const regex = /(\w+(?:_\w+)*)='([^']*)'/g;
      let match;
      
      while ((match = regex.exec(ocrData)) !== null) {
        const key = match[1];
        const value = match[2];
        
        console.log(`Parsed: ${key} = ${value}`); // Debug log
        
        // Map the keys to our expected format
        switch (key) {
          case 'full_name': {
            const tokens = value
              .split(/\s+/)
              .map((t) => t.trim())
              .filter(Boolean);
            result.first_name = tokens.length > 0 ? tokens[0] : '';
            result.last_name = tokens.length > 1 ? tokens[tokens.length - 1] : '';
            break;
          }
          case 'date_of_birth':
            result.date_of_birth = value;
            break;
          case 'gender':
            result.gender = value.toLowerCase();
            break;
          case 'address':
            result.address = value;
            break;
          case 'profession':
            result.profession = value;
            break;
          case 'marital_status':
            result.marital_status = value.toLowerCase();
            break;
        }
      }
      
      console.log("Final parsed result:", result); // Debug log
      return result;
    } catch (parseError) {
      console.error("Error parsing OCR response:", parseError);
      throw new Error("Failed to parse OCR response data");
    }
  }
}

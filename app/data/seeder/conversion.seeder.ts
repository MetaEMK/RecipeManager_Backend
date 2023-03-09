import { AppDataSource } from "../../config/datasource.js";
import { Conversion } from "../entities/conversion.entity.js";
import { ConversionType } from "../entities/conversion_type.entity.js";
import { Size } from "../entities/size.entity.js";

/**
 * Seeds conversion types, as well as corresponding sizes and conversions
 */
export async function seedConversion()
{
    console.log("Seeding conversions...");

    // Master data
    const data = [
        {
            name: "Rund",
            sizes: [
                "12cm", "16cm", "18cm", "20cm", "22cm"
            ],
            conversions: [
                [undefined, 0.6, 0.4, 0.4, 0.3],
                [1.8, undefined, 0.8, 0.6, 0.5],
                [2.3, 1.3, undefined, 0.8, 0.7],
                [2.8, 1.6, 1.2, undefined, 0.8],
                [3.4, 1.9, 1.5, 1.2, undefined]
            ]
        },
        {
            name: "Eckig",
            sizes: [
                "11x25", "11x30", "11x35", "26x34", "26x38"
            ],
            conversions: [
                [undefined, 0.8, 0.7, 0.2, 0.2],
                [1.2, undefined, 0.8, 0.3, 0.3],
                [1.4, 1.2, undefined, 0.3, 0.3],
                [4.3, 3.5, 3.0, undefined, 0.9],
                [4.8, 3.9, 3.3, 1.1, undefined]
            ]
        }
    ];

    // Entity Arrays
    const conversionTypes: Array<ConversionType> = [];
    const sizes: Array<Size> = [];
    const conversions: Array<Conversion> = [];

    for (let i = 0; i < data.length; i++) {
        // Conversion Types
        const conversionType = new ConversionType();
        conversionType.name = data[i].name;
        conversionTypes.push(conversionType);
        
        // Sizes
        const tmpSizes = [];
        for (let j = 0; j < data[i].sizes.length; j++) {
            const size = new Size();
            size.name = data[i].sizes[j];
            size.conversionType = conversionType;
            sizes.push(size);
            tmpSizes.push(size);
        }

        // Conversions
        for (let m = 0; m < tmpSizes.length; m++) {
            for (let n = 0; n < tmpSizes.length; n++) {
                const multiplicator = data[i].conversions[m][n];
                if (multiplicator) {
                    const conversion = new Conversion();
                    conversion.conversionType = conversionType;
                    conversion.fromSize = tmpSizes[m];
                    conversion.toSize = tmpSizes[n];
                    conversion.multiplicator = multiplicator;
                    conversions.push(conversion);
                }
            }
        }
    }

    await AppDataSource.getRepository(ConversionType).save(conversionTypes);
    console.log("Conversion Types created.");

    await AppDataSource.getRepository(Size).save(sizes);
    console.log("Sizes created.");

    await AppDataSource.getRepository(Conversion).save(conversions);
    console.log("Conversions created.");
}

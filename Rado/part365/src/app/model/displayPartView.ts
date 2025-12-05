import { StaticSelectionService } from "@services/staticSelection.service";
import { ItemType } from "./enum/itemType.enum";
import { ApprovedType } from "./enum/approveType.enum";
import { UserType } from "./enum/userType.enum";
import { ImageData } from "./imageData";
import { NgxGalleryImage } from "@app/ngx-gallery/models/ngx-gallery-image.model";
import { convertImage, dateString, isPart } from "@app/functions/functions";

export class DisplayPartView {
  id?               : number;
  itemType?         : ItemType;
  sellerName?       : string;
  sellerPhone?      : string;
  sellerPhone2?     : string;
  sellerViber?      : string;
  sellerWhats?      : string;
  sellerCity?       : string;
  sellerLogo?       : string;
  sellerWebPage?    : string;
  // extra
  ngImages?         : NgxGalleryImage[] = [];
  numberImages?     : number;
  mainImageData?    : ImageData;
  images?           : ImageData[];
  mainImage?        : NgxGalleryImage;

  userId?           : number;
  regionId?         : number;
  approved?         : ApprovedType
  mainPicture?      : string;

  isCar?            : boolean;
  bus?              : number;
  carId?            : number
  companyId?        : number;
  modelId?          : number;
  modificationId?   : number;
  companyName?      : string;
  modelName?        : string;
  modificationName? : string;
  dealerSubCategoryName?    : string;
  partNumber?       : string;
  price?            : number;
  year?             : number;
  description?      : string;
  vin?              : string;
  engineType?       : number;
  engineModel?      : string;
  gearboxType?      : number;
  millage?           : number;
  powerBHP?         : number;
  modifiedTime?     : number;
  leftRightPosition?: number;
  frontBackPosition?: number;
  categoryName?     : string;
  sellerCompanyName?: string;

  yearName?         : string;

  descriptionModel? : string = '';
  positionDesc?     : string;
  modifiedTimeDesc? : string;
  phonesDesc?       : string;
  engineTypeDesc?   : string;
  gearboxDesc?      : string;

  tyreCompanyId?    : number;
  tyreWidth?        : number;
  tyreHeight?       : number;
  tyreRadius?       : number;
  tyreType?         : number;
  rimWidth?         : number;
  rimMaterial?      : number;
  rimOffset?        : number;
  rimBoltCount?     : number;
  rimBoltDistance?  : number;
  rimCenter?        : number;

  tyreCompanyName?  : string;
  tyreWidthName?    : string;
  tyreHeightName?   : string;
  tyreRadiusName?   : string;
  tyreTypeName?     : string;
  rimWidthName?     : string;
  rimMaterialName?  : string;
  rimOffsetName?    : string;
  rimBoltCountName? : string;
  rimBoltDistanceName?: string;
  rimCenterName?    : string;
  count?            : number;
  monthDOT?         : number;
  yearDOT?          : number;

  tags?             : object;
  rimTags?          : object;
  tyreTags?         : object;
  partTagsMap?         : Map<string, string>;
  rimTagsMap?          : Map<string, string>;
  tyreTagsMap?         : Map<string, string>;
  regionName?       : string;
  dealer?           : UserType;
  isRim?:            boolean;
  isTyre?:        boolean;
}

function getPhones(data: DisplayPartView) {
  const _phones = [];
  if (data.sellerPhone) _phones.push(data.sellerPhone);
  if (data.sellerPhone2) _phones.push(data.sellerPhone2);
  if (_phones.length)
    return _phones.join('/');

  return undefined;
}

export function Enrich(data: DisplayPartView, staticService: StaticSelectionService): DisplayPartView {
  
//   if (data.part) {
//     if (data.isCar)
//       data.id = data.part.carId;
//     else 
//       data.id = data.part.partId;
//     data.bus = data.part.bus;
//     data.isCar = data.part.isCar;
//     data.carId = data.part.carId
//     data.companyId = data.part.companyId;
//     data.modelId = data.part.modelId;
//     data.modificationId = data.part.modificationId;
//     data.companyName = data.part.companyName
//     data.modelName = data.part.modelName
//     data.modificationName = data.part.modificationName
//     data.dealerSubCategoryName = data.part.dealerSubCategoryName;
//     data.partNumber = data.part.partNumber
//     data.price = data.part.price
//     data.year = data.part.year
//     data.vin = data.part.vin
//     data.engineType = data.part.engineType
//     data.engineModel = data.part.engineModel
//     data.gearboxType = data.part.gearboxType
//     data.millage = data.part.millage
//     data.powerBHP = data.part.powerBHP
//     data.modifiedTime = data.part.modifiedTime
//     data.leftRightPosition = data.part.leftRightPosition
//     data.frontBackPosition = data.part.frontBackPosition
//     data.categoryName = data.part.categoryName
//     data.yearName = data.part.yearName;
// }
//   if (data.rimWithTyre) {
//     data.companyId = data.rimWithTyre.companyId;
//     data.modelId = data.rimWithTyre.modelId;
//     data.companyName = data.rimWithTyre.companyName;
//     data.modelName = data.rimWithTyre.modelName;
//     data.tyreCompanyId = data.rimWithTyre.tyreCompanyId;
//     data.tyreWidth = data.rimWithTyre.tyreWidth;
//     data.tyreHeight = data.rimWithTyre.tyreHeight;
//     data.tyreRadius = data.rimWithTyre.tyreRadius;
//     data.tyreType = data.rimWithTyre.tyreType;
//     data.rimWidth = data.rimWithTyre.rimWidth;
//     data.rimMaterial = data.rimWithTyre.rimMaterial;
//     data.rimOffset = data.rimWithTyre.rimOffset;
//     data.rimBoltCount = data.rimWithTyre.rimBoltCount;
//     data.rimBoltDistance = data.rimWithTyre.rimBoltDistance;
//     data.rimCenter = data.rimWithTyre.rimCenter;
//     data.modifiedTime = data.rimWithTyre.modifiedTime
//     data.count = data.rimWithTyre.count;
//     data.monthDOT = data.rimWithTyre.monthDOT;
//     data.yearDOT = data.rimWithTyre.yearDOT;
//   }
  try {
    data.mainImage = convertImage(data.mainImageData!);
    const images_: NgxGalleryImage[] = []
    data.images?.forEach((image) => {
        const convertedImage = convertImage(image)
        if (convertedImage) {
            images_.push(convertedImage)
        }
    })
    data.ngImages = [...images_]  }
  catch
  {
    console.log(data)
  }
  data.regionName = staticService.getRegion(data.regionId!);
  data.modifiedTimeDesc = dateString(data.modifiedTime!);
  data.phonesDesc = getPhones(data);

  if (isPart(data.itemType!)) {
    data.engineTypeDesc = staticService.engineTypeDescription(data.engineType!);
    data.gearboxDesc = staticService.GearboxType.filter(x => x.value === data.gearboxType)[0]?.text;
  }
  data.tyreRadiusName = staticService.TyreRadius.find(elem => elem.value === data.tyreRadius)?.text;

  if (data.itemType === ItemType.Tyre || data.itemType === ItemType.RimWithTyre) {
    data.tyreCompanyName = staticService.TyreProducers.find(elem => elem.value === data.tyreCompanyId)?.text;
    data.tyreWidthName = staticService.TyreWidth.find(elem => elem.value === data.tyreWidth)?.text;
    data.tyreHeightName = staticService.TyreHeight.find(elem => elem.value === data.tyreHeight)?.text;
    data.tyreTypeName = staticService.TyreType.find(elem => elem.value === data.tyreType)?.text;
  }
  if (data.itemType === ItemType.Rim || data.itemType === ItemType.RimWithTyre) {
    data.rimWidthName = staticService.RimWidth.find(elem => elem.value === data.rimWidth)?.text;
    data.rimMaterialName = staticService.RimMaterial.find(elem => elem.value === data.rimMaterial)?.text;
    data.rimOffsetName = staticService.RimOffset.find(elem => elem.value === data.rimOffset)?.text;
    data.rimBoltCountName = data.rimBoltCount?.toString();
    data.rimBoltDistanceName = staticService.BoltDistance.find(elem => elem.value === data.rimBoltDistance)?.text;
    data.rimCenterName = staticService.RimCenter.find(elem => elem.value === data.rimCenter)?.text;
  }


  if (data.tags)
    data.partTagsMap = new Map(Object.entries(data.tags!));
  else 
    data.partTagsMap = new Map();

  if (data.rimTags)
    data.rimTagsMap = new Map(Object.entries(data.rimTags));
  else 
    data.rimTagsMap = new Map();

  if (data.tyreTags)
    data.tyreTagsMap = new Map(Object.entries(data.tyreTags));
  else 
    data.tyreTagsMap = new Map();

    data.isTyre = data.itemType == ItemType.Tyre || data.itemType == ItemType.RimWithTyre;
    data.isRim = data.itemType == ItemType.Rim || data.itemType == ItemType.RimWithTyre;

  // data.companyName = data.rimTags?.get("Компания");
  return data;
}


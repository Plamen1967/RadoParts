import { CONSTANT } from '@app/constant/globalLabels'
import { Car } from '@model/car/car'
import { DisplayPartView } from '@model/displayPartView'
import { PositionFB } from '@model/enum/positionFB.enum'
import { PositionLR } from '@model/enum/positionLR.enum'
import { Part } from '@model/part/part'
import { PartView } from '@model/part/partView'
import { SelectOption } from '@model/selectOption'
import { User } from '@model/user'
import { ImageData } from '@model/imageData'
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model'
import { SortType } from '@model/enum/sortType.enum'
import { ItemType } from '@model/enum/itemType.enum'

export function replaceFirst(x: SelectOption): SelectOption {
    if (x.value === 0) {
        return { ...x, text: 'Всички' }
    }
    return x
}

export function sortCar(a: Car, b: Car) {
    return a.regNumber! < b.regNumber! ? -1 : 1
}

export function sortUser(a: User, b: User) {
    return a.userName! < b.userName! ? -1 : 1
}

function compare<T>(a: T, b: T) {
    if (a < b) return -1
    else if (a > b) return 1

    return 0
}

// viber://forward/?text=BMW%20X5%203.0d%20Xdrive%20Face%20https://www.mobile.bg/pcgi/mobile.cgi?act=4&adv=21464071772273051
export function viberContactRef(viber: string) {
    return `viber://contact?number=${viber}`
}
// viber://forward?text=Alfa%20Romeo%20159%20sportwagon%201.8i/140k.c.%20https://www.mobile.bg/pcgi/mobile.cgi?act=4&adv=11667195069190215
export function viberForwardRef(message: string, viber: string) {
    return `viber://forward?text=${viber}&number=${viber}`
}

export function viberCallRef(viber: string) {
    return `viber://calls?number=${viber}`
}

export function viberChatRef(viber: string) {
    return `viber://chat?number=${viber}`
}

export function sortPart(sortType: SortType, a: DisplayPartView, b: DisplayPartView) {
    if (sortType == SortType.PriceAsc) return compare(a.price ?? 0, b.price ?? 0)
    if (sortType == SortType.PriceDesc) return compare(b.price ?? 0, a.price ?? 0)
    if (sortType == SortType.PartNumberAsc) return compare(a.partNumber, b.partNumber)
    if (sortType == SortType.PartNumberDesc) return compare(b.partNumber, a.partNumber)
    if (sortType == SortType.YearAsc) return compare(a.year, b.year)
    if (sortType == SortType.YearDesc) return compare(b.year, a.year)
    if (sortType == SortType.modifiedTimeAsc) return compare(a.modifiedTime, b.modifiedTime)
    if (sortType == SortType.modifiedTimeDesc) return compare(b.modifiedTime, a.modifiedTime)
    if (sortType == SortType.powerBHPAsc) return compare(a.powerBHP, b.powerBHP)
    if (sortType == SortType.powerBHPDesc) return compare(b.powerBHP, a.powerBHP)
    if (sortType == 0) return compare(a.price, b.price)

    return compare(a.price, b.price)
}

export function sortPartView(sortType: number, a: PartView, b: PartView) {
    if (sortType == SortType.PriceAsc) return compare(a.price, b.price)
    if (sortType == SortType.PriceDesc) return compare(b.price, a.price)
    if (sortType == SortType.PartNumberAsc) return compare(a.partNumber, b.partNumber)
    if (sortType == SortType.PartNumberDesc) return compare(b.partNumber, a.partNumber)
    if (sortType == SortType.YearAsc) return compare(a.year, b.year)
    if (sortType == SortType.YearDesc) return compare(b.year, a.year)
    if (sortType == SortType.modifiedTimeAsc) return compare(a.modifiedTime, b.modifiedTime)
    if (sortType == SortType.modifiedTimeDesc) return compare(b.modifiedTime, a.modifiedTime)
    if (sortType == SortType.powerBHPAsc) return compare(a.powerBHP, b.powerBHP)
    if (sortType == SortType.powerBHPDesc) return compare(b.powerBHP, a.powerBHP)

    return compare(a.price, b.price)
}

export function positionDescription(part: Part) {
    let positionDesc: string | undefined = ''

    if (part.frontBackPosition === PositionFB.Back) {
        positionDesc = CONSTANT.BACK
    } else if (part.frontBackPosition === PositionFB.Front) {
        positionDesc = CONSTANT.FRONT
    }
    if (part.leftRightPosition === PositionLR.Left) {
        positionDesc += ' ' + CONSTANT.LEFT
    } else if (part.leftRightPosition === PositionLR.Right) {
        positionDesc += ' ' + CONSTANT.RIGHT
    }

    return positionDesc === '' ? undefined : positionDesc
}

export function dateString(date: number) {
    const tempDate = new Date(date)
    return [padTo2Digits(tempDate.getDate()), padTo2Digits(tempDate.getMonth() + 1), tempDate.getFullYear()].join('/')
}
export function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0')
}

export function convertDate(dateTime: number) {
    const date = new Date(dateTime)
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/')
}

export function convertImage(image: ImageData) {
    if (!image) return undefined

    const ngximage: NgxGalleryImage = {}
    if (image.imageMinSrc) {
        ngximage.small = `${image.imageMinSrc}`
        ngximage.medium = `${image.imageSrc}`
        ngximage.big = `${image.imageSrc}`
    } else {
        ngximage.small = `${image.imageData}`
        ngximage.medium = `${image.imageData}`
        ngximage.big = `${image.imageData}`
    }
    return ngximage
}

export function convertImages(images: ImageData[]): NgxGalleryImage[] {
    const _images: NgxGalleryImage[] = []
    images.forEach((image) => {
        _images.push(convertImage(image)!)
    })

    return _images
}

export function getPhonesAsString(phone1: string, phone2: string) {
    const _phones = []
    if (phone1) _phones.push(phone1)
    if (phone2) _phones.push(phone2)

    return _phones.join('  ')
}

export function getPosition(part: DisplayPartView) {
    if (part.frontBackPosition === PositionFB.None && part.leftRightPosition === PositionLR.None) return ''
    let positionDesc = ''
    if (part.frontBackPosition === PositionFB.Back) {
        positionDesc = CONSTANT.BACK
    } else if (part.frontBackPosition === PositionFB.Front) {
        positionDesc = CONSTANT.FRONT
    }
    if (part.leftRightPosition === PositionLR.Left) {
        positionDesc += ' ' + CONSTANT.LEFT
    } else if (part.leftRightPosition === PositionLR.Right) {
        positionDesc += ' ' + CONSTANT.RIGHT
    }

    return `${CONSTANT.POSITION}: ${positionDesc}`
}

export function isMobile() {
    // let check = false;
    // (function (a) {
    //     if (
    //         /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    //             a
    //         ) ||
    //         /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    //             a.substr(0, 4)
    //         )
    //     )
    //         check = true
    // })(navigator.userAgent || navigator.vendor)
    return true
}

// const removeUndefinedValuesFromObject = <T>(obj: T): T => {
//     Object.keys(obj).forEach((key) => obj[key as keyof typeof obj] === undefined && delete obj[key as keyof typeof obj]);
//     return obj;
//   };

//   const cleanData = (data: {}) => Object.entries(data)
//   .filter(([key, value]) => value !== undefined)
//   .reduce((obj, [key, value]) => {
//     obj[key as keyof typeof obj] = value;
//     return obj;
//   }, {});

export function removeUndefined<T>(data: T): T {
    let key: keyof T
    for (key in data) {
        if (data[key as keyof typeof data] === undefined || data[key as keyof typeof data] === null) {
            delete data[key]
        }
    }
    return data
}

export function allSelectOption(): SelectOption {
    return { value: 0, text: CONSTANT.ALL }
}

export function isPart(itemType: ItemType) {
    return itemType === ItemType.OnlyCar || itemType === ItemType.OnlyBus || itemType === ItemType.BusPart || itemType === ItemType.CarPart
}

export function goToPosition(id: string | number | undefined): void {
    if (!id) return
    setTimeout(() => {
        const element = window.document.getElementById(`${id}`)
        if (element) {
            element.scrollIntoView({
                behavior: 'instant',
                block: 'start',
                inline: 'nearest',
            })
        }
    }, 2000)

    console.log(`goToPosition ${id}`)
}

export function goTop(): void {
    window.scrollTo({ top: 0, left: 0 })
    // window.document.body.scrollTop = 0 // For Safari
    // window.document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'instant',
    })
    window.scroll(0, 0)
    const body = window.document.body
    if (body)
        body.scrollIntoView({
            behavior: 'instant',
            block: 'start',
            inline: 'nearest',
        })

    console.log(`goToTop`)
}

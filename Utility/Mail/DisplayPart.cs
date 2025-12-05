using System;

public class DisplayPartMessageOld
{
		static public string GenerateMessage(string imageData, string description)
		{
			return Message(imageData);
		}

		static public string Message(string src)
		{
//		string style = @"<style> .rounded {
//							border-radius: .25rem!important;
//						}
//						.text-dark {
//						   --bs-text-opacity: 1;
//							color: #212529!important;
//							color: rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important;
//						}
//						.mb-2 {
//							margin-bottom: .5rem!important;
//						}
//						.row {
//							--bs-gutter-x: 1.5rem;
//							--bs-gutter-y: 0;
//							display: flex;
//							flex-wrap: wrap;
//							margin-top: calc(-1 * var(--bs-gutter-y));
//							margin-right: calc(-.5 * var(--bs-gutter-x));
//							margin-left: calc(-.5 * var(--bs-gutter-x));
//						}
//						*, :after, :before {
//							box-sizing: border-box;
//						}
//						*, :after, :before {
//							box-sizing: border-box;
//						}
//						div {
//							display: block;
//						}
//.pe-0 {
//    padding-right: 0!important;
//}
//.row>* {
//    flex-shrink: 0;
//    width: 100%;
//    max-width: 100%;
//    padding-right: calc(var(--bs-gutter-x) * .5);
//    padding-left: calc(var(--bs-gutter-x) * .5);
//    margin-top: var(--bs-gutter-y);
//}
//.containerImage[_ngcontent-ng-cli-universal-c70] {
//    display: flex;
//    flex-flow: row;
//}
//.pe-1 {
//    padding-right: .25rem!important;
//}
//.mt-1 {
//    margin-top: .25rem!important;
//}
//.col-sm-4 {
//    flex: 0 0 auto;
//    width: 33.33333333%;
//}
//.text-dark {
//    --bs-text-opacity: 1;
//    color: #212529!important;
//    color: rgba(var(--bs-dark-rgb),var(--bs-text-opacity))!important;
//}
//div[_ngcontent-ng-cli-universal-c69] {
//    width: 100%;
//    height: 100%;
//}
//div[_ngcontent-ng-cli-universal-c69]   img[_ngcontent-ng-cli-universal-c69] {
//    display: block;
//    width: 195px;
//    height: 139px;
//}
//.img-thumbnail {
//    padding: .25rem;
//    background-color: #fff;
//    border: 1px solid #dee2e6;
//    border-radius: .25rem;
//}
//.img-fluid, .img-thumbnail {
//    max-width: 100%;
//    height: auto;
//}
//img, svg {
//    vertical-align: middle;
//}
//.small, small {
//    font-size: .875em;
//}
//a {
//    color: #0d6efd;
//    text-decoration: underline;
//}
//.padding6[_ngcontent-ng-cli-universal-c70] {
//    padding-left: 6px;
//}
//.companySize[_ngcontent-ng-cli-universal-c70] {
//    width: 16em;
//    height: 6em;
//    cursor: pointer;
//}
//.d-flex {
//    display: flex!important;
//}
//.mt-4 {
//    margin-top: 1.5rem!important;
//}
//.text-center {
//    text-align: center!important;
//}
//.paddingClass[_ngcontent-ng-cli-universal-c65] {
//    padding-left: 2em;
//}
//.unSaved[_ngcontent-ng-cli-universal-c65] {
//    color: coral;
//}
//.favoirite[_ngcontent-ng-cli-universal-c65] {
//    font-size: 1.8em;
//    font-weight: 700;
//    border: none;
//    background-color: transparent;
//}
//.la, .lar, .las {
//    font-family: Line Awesome Free;
//}
//.lar {
//    font-weight: 400;
//}
//.la, .lab, .lad, .lal, .lar, .las {
//    -moz-osx-font-smoothing: grayscale;
//    -webkit-font-smoothing: antialiased;
//    display: inline-block;
//    font-style: normal;
//    font-feature-settings: normal;
//    font-variant: normal;
//    text-rendering: auto;
//    line-height: 1;
//}
//.paddingRow[_ngcontent-ng-cli-universal-c70] {
//    padding-right: .3rem!important;
//}
//.mt-1 {
//    margin-top: .25rem!important;
//}
//.col-sm-8 {
//    flex: 0 0 auto;
//    width: 66.66666667%;
//}
//.pe-0 {
//    padding-right: 0!important;
//}
//.col-sm-8 {
//    flex: 0 0 auto;
//    width: 66.66666667%;
//}
//.col-sm-8 {
//    flex: 0 0 auto;
//    width: 66.66666667%;
//}
//.fw-bold {
//    font-weight: 700!important;
//}
//.favourite[_ngcontent-ng-cli-universal-c70] {
//    display: block;
//}
//.col-sm-1 {
//    flex: 0 0 auto;
//    width: 8.33333333%;
//}
//.col-sm-9 {
//    flex: 0 0 auto;
//    width: 75%;
//}</style>
//";
			//string message = @$"<div>
			//					<div class='row text-dark mb-2 rounded' style='background-color: beige; border: 1px solid lightgray; box-shadow: lightgray 2px 2px; '>
			//						<div class='row pe-0'>
			//							<div data-toggle='tooltip' data-placement='top' title='Повече детайли за частта' class='col-sm-4 mt-1 pe-1 containerImage' style='cursor: pointer; '>
			//							</div>
			//							<div class='col-sm-8 mt-1 paddingRow'>
			//								<div class='row'>
			//									<div class='col-sm-8 pe-0'>
			//										<div class='row'>
			//											<div data-toggle='tooltip' data-placement='top' title='Повече детайли за частта' class='col-sm-8' style='cursor: pointer; '>
			//												<small data-cy='carModel' class='fw - bold'>Isuzu KB  на части</small>
			//											</div>
			//											<div  class='col-sm-1 favourite'>
			//												<app-favourite >
			//													<div  class='paddingClass'>
			//														<div>
			//															<button  data-toggle='tooltip' data-placement='top' title='Запази обява' class='favoirite unSaved'>
			//																<span  class='icon - la lar'></span>
			//															</button>
			//														</div>
			//													</div>
			//												</app-favourite>
			//											</div>
			//										</div>
			//										<div  class='row'>
			//											<div  data-toggle='tooltip' data-placement='top' title='Повече детайли за частта' class='col - sm - 9' style='cursor: pointer; '>
			//												<small class='fw-bold'>KB Pick-up I (01.1972 - 12.1980)</small>
			//											</div>
			//										</div>
			//										<div  class='row'>
			//											<small class='fw-bold'>2021</small>
			//										</div>
			//										<div  class='d_flex'>
			//											<small  data-cy='sellerName' class='me-2'><i  class='las la-phone - volume'></i> 0123012301234 </small>
			//										</div>
			//										<div  class='row'>
			//											<small  data-cy='region'>Русе</small>
			//										</div>
			//										<div  class='row'>
			//											<div  class='col-sm-9'>
			//												<small  data-cy='modifiedTime' class='d - inline'>Публикувана 23/11/2022</small>
			//											</div>
			//											<div  class='col-sm-3'>
			//											</div>
			//										</div>
			//									</div>
			//								<div  data-placement='top' title='Към страницата на дилъра' class='col - sm - 4 company companyPadding'>
			//									<div  class='d-flex justify-content-end'>
			//									</div>
			//								</div>
			//							</div>
			//						</div>
			//					</div>
			//				</div>
			//			</div>";
			return "";
	}

}

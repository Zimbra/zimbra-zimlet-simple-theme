//Load components from Zimbra
import { createElement } from 'preact';

//Create function by Zimbra convention
export default function Zimlet(context) {
	const { plugins } = context;
	const exports = {};

	//Get all zimlets
	const zimlets = context.getAccount().zimlets
	let globalConfig = new Map();
	//Get demo zimlet
	let zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-simple-theme");

	/*Zimbra Zimlet Sideloader does not support reading Zimlet configuration xml's, 
		* so to read a configuration you must either package and deploy the Zimlet using zmzimletctl 
		* or use this work around so you can develop with Sideloader. This will help if you have not 
		* made a final decision on what properties you want in your config_template.xml and what to 
		* develop them on-the-fly.
		* 
		* IT IS ***STRONGLY*** ADVISED TO NOT USE THIS WORKAROUND IN PRODUCTION:
		* */
		/*
	if (!zimlet) {
		zimlets.zimlet.push(
			{
				"__typename": "AccountZimletInfo",
				"zimletContext": null,
				"zimlet": [
					{
						"__typename": "AccountZimletDesc",
						"name": "zimbra-zimlet-simple-theme",
						"label": null,
						"zimbraXZimletCompatibleSemVer": null,
						"description": null
					}
				],
				"zimletConfig": [
					{
						"__typename": "AccountZimletConfigInfo",
						"global": [
							{
								"__typename": "ZimletConfigGlobal",
								"property": [
									{
										"__typename": "ZimletConfigProperty",
										"name": "primaryColor",
										"content": "#ff0000"
									},
									{
										"__typename": "ZimletConfigProperty",
										"name": "secondaryColor",
										"content": "#fbcebd"
									},
									{
										"__typename": "ZimletConfigProperty",
										"name": "logo",
										"content": "url('https://www.zimbra.com/wp-content/uploads/2016/06/zimbra-logo-color-282.png')"
									}
								]
							}
						],
						"host": null,
						"property": null,
						"name": "zimbra-zimlet-simple-theme",
						"version": null
					}
				]
			});
		zimlet = zimlets.zimlet.find(zimlet => zimlet.zimlet[0].name === "zimbra-zimlet-simple-theme");
	}
	*/
	/*end sideloader work-around*/

	//Add all demo zimlet configuration properties to an ES6 Map from the Zimbra server

	if (zimlet) {
			const gc = zimlet.zimletConfig[0].global[0].property || [];
			for (var i = 0; i < gc.length; i++) {
				 globalConfig.set(gc[i].name, gc[i].content);
			};
	}
	if(zimlet.zimletContext[0].presence == "enabled")
	{
      const domain = context.getAccount().name.split('@').pop();
      const primaryColor = globalConfig.get(domain+'-primaryColor') ? globalConfig.get(domain+'-primaryColor') : globalConfig.get('primaryColor');
      const secondaryColor = globalConfig.get(domain+'-secondaryColor') ? globalConfig.get(domain+'-secondaryColor') : globalConfig.get('secondaryColor');
      const logo = globalConfig.get(domain+'-logo') ? globalConfig.get(domain+'-logo') : globalConfig.get('logo');
      
		window.parent.document.head.insertAdjacentHTML("beforeend", `<style>
		:root {
		--brand-primary-500:`+primaryColor+`;
		--brand-primary-100:`+secondaryColor+`;
		--brand-tertiary-500:`+primaryColor+`;
		}
		
		.zimbra-client_client-logo_logo{
		display:none;
		}
		
		.zimbra-client_header_primaryLogo {
		background: `+logo+`;
		background-repeat: no-repeat;
		background-size: 100% auto;
		background-position: center center;
		height:100%;
		}
		</style>`);
	}
	//required by framework
	exports.init = function init() {
	};
	return exports;
}

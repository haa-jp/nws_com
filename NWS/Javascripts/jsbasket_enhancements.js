
	function checkTextarea() {
		
		textarea = $('textarea');


		var value = textarea.val().trim(),
		productLines = [],
		error = false,
		i = 0,
		products = {};
		
		//console.log("Text area value: " + value);

		if(value == ''){

			textarea.focus();
			//this.addFieldError($this.textarea, vars['empty_textarea_error']);
			console.log("Text area is empty");
		}
		
		else
			{

			//this.removeFieldError($this.textarea);

			productLines = value.split(/\n/);

			if(productLines.length == 0){

				//this.addFieldError($this.textarea, vars['empty_textarea_error']);
				//this.addFieldError($this.find('.js-basket-input'), vars['empty_textarea_error']);
				console.out("Empty");
			}
			
			else
			{

				//this.removeFieldError($this.textarea);

				var str = '',
				lastWord = '',
				firstWord = '',
				error_key = 'format_textarea_error',
				j;
				
				var positionshtml = '', 
					resultshtml = '',
					numOfRows = 0;

				for(i; i < productLines.length; i+=1)
				{
					
					
					str = productLines[i].trim();
					str = str.replace(',', ' ').trim();
					var tmp = str.split(/\s+/);
					
					/*
					firstWord = tmp.shift();
					lastWord = tmp.pop();
					
					if(lastWord) 
						products[firstWord.trim()] = lastWord.trim();
						*/
						
					positionshtml += '<tr class="child"><td>' + str + '</td>';
					for(var x = 0;x < tmp.length;x++)
						positionshtml += '<td>' + tmp[x] + '</td>';
					
					positionshtml += '</tr>';
					
					$('#positions-table tbody').html(positionshtml);
					
					if($('#radFCIDealerVue').prop('checked'))
					{
						resultshtml += '<tr class="child"><td>' + tmp[0] + '</td><td>' + parseInt(tmp[tmp.length-4]) + '</td></tr>';
					}					
					else if($('#radLightSpeed').prop('checked'))
					{
						var productCode;
						
						if(!productCode || productCode == '')
						{
							productCode = tmp[0];
						}
						
						if(tmp.length >= 3)
						{
							if(tmp[tmp.length-1].indexOf("$") !== -1)
							{
								resultshtml += '<tr class="child"><td>' + productCode + '</td><td>' + parseInt(tmp[tmp.length-3]) + '</td></tr>';
								productCode = '';
							}
							else if(tmp[tmp.length-2].indexOf("$") !== -1)
							{
								resultshtml += '<tr class="child"><td>' + productCode + '</td><td>' + parseInt(tmp[tmp.length-4]) + '</td></tr>';
								productCode = '';
							}
							else if(tmp[tmp.length-3].indexOf("$") !== -1)
							{
								resultshtml += '<tr class="child"><td>' + productCode + '</td><td>' + parseInt(tmp[tmp.length-5]) + '</td></tr>';
								productCode = '';
							}
						}
					}				
					else if($('#radQuickbooks').prop('checked'))
					{
						resultshtml += '<tr class="child"><td>' + tmp[0] + '</td><td>' + parseInt(tmp[tmp.length-3]) + '</td></tr>';
					}			
					else if($('#radSystem2000').prop('checked'))
					{
						if(tmp[0] == numOfRows + 1)
						{
							resultshtml += '<tr class="child"><td>' + tmp[1] + '</td><td>' + parseInt(tmp[2]) + '</td></tr>';
							numOfRows+=1;
						}
					}					
					else if($('#radTotalControl').prop('checked'))
					{
						if(tmp.length > 3)
						{
							resultshtml += '<tr class="child"><td>' + tmp[0] + '</td><td>' + parseInt(tmp[tmp.length-3]) + '</td></tr>';
						}
					}
					else
					{
						console.out("Radio button error");
					}
					
					$('#results-table tbody').html(resultshtml);
				}
			}
		}
	};

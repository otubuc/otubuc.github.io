var galleryWidgetElements = document.querySelectorAll('.gallery-widget');

for (var i = 0, controlViewElement; i < galleryWidgetElements.length; i++)
{
	controlViewElement = galleryWidgetElements[i].querySelector('.control-view');
	
	controlViewElement.galleryWidgetElement = galleryWidgetElements[i];
	
	controlViewElement.addEventListener('change', function ()
	{
		toggleView(this.galleryWidgetElement);
	});
}

function toggleView(galleryWidgetElement)
{
	galleryWidgetElement.classList.toggle('list-view');
}

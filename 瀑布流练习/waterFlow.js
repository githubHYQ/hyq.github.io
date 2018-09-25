/*封装一个瀑布流插件*/
(function($){
	// 把当前盒子下面所有的子元素初始化瀑布流的布局
	// 瀑布流容器

	$.fn.waterfall=function(){

		var parentWidth=$(this).width();

		var items=$(this).children();

		// 瀑布流布局的item
		var imgbox=items.children();

		var childWidth=imgbox.width();
		// 定义每一行多少列
		var columnCount=5;
		//列间距
		var space=(parentWidth-childWidth*columnCount)/(columnCount-1);
		// 定义一个数组 记录每一列高度的变化
		var columnArray=[];
		// 遍历所有imgbox
		$.each(imgbox,function(index,obj){

			var height=$(obj).height();

			// 记录第一列的高度 
			// 第一列有点特殊  所有的top都是0 
			if(index<columnCount){

				columnArray[index]=height;

				// 针对每一个盒子设置定位
				$(obj).css({
					top:0,
					left:index*(childWidth+space)
				})
			}
			else {
				// 每一次度需要追加到最矮的那一列
				// 怎么找到最矮那一列
				// 假设第一列 是最矮的
				var minHeight=columnArray[0];
				var minIndex=0;
				// 遍历存放高度记录的数组
				for(var i = 0 ; i <columnArray.length; i++){

					// 如果第一个比第二个小
						if(minHeight>columnArray[i]){
							//  那么把小的一列高度赋值给第一个
							minHeight = columnArray[i];
							// 最矮那一列的索引值
							minIndex=i;
						}
				}
				// 当我们接一个盒子之后	我们要更新当前列的高度
				columnArray[minIndex] += height+10;
				// 计算 定位 top: 最矮列高度+间距
				// 			 left:最矮列索引*（列宽+间距）
				$(obj).css({
					top:minHeight+10,
					left:minIndex*(childWidth+space)
				})

			}

			console.log(columnArray)
		});
		
		
		

		var maxHeight=columnArray[0];
		for(var j = 0 ; j <columnArray.length; j++){
			if(maxHeight<columnArray[j]){
				maxHeight=columnArray[j];
			}
		}
		console.log(maxHeight)
		$(".items").height(maxHeight)

	}

})(jQuery)
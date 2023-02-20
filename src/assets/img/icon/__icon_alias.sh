#!/bin/bash

while read line
do
array=(`echo $line |xargs`);
fromon="icon_${array[0]}_on.png"
fromoff="icon_${array[0]}_off.png"
toon="icon_${array[1]}_on.png"
tooff="icon_${array[1]}_off.png"

ln -s $fromon $toon
ln -s $fromoff $tooff
#echo "ln -s $fromon $toon"
#echo "ln -s $fromoff $tooff"

done < ./__icon_reuse_list.txt

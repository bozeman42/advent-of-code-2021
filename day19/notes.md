## To rotate about the Z axis for different "up"
x -> y (x becomes y)
y -> -x (y -> -x) y value becomes negative x value

## z facing (original orientation)
[ x, y, z] // original orientation we'll call this 'z'
[-y, x, z] // different "up"
[-x,-y, z]
[ y,-x, z]

now orientation where +y axis is where +z axis was. call this y.
y -> z
z -> -y
x -> x
[ x,-z, y] // new y is z orientation.
[ z, x, y] // different "ups"
[-x, z, y]
[-z,-x, y]

x facing. x -> z, z -> -x
[-z, y, x]
[-y,-z, x]
[ z,-y, x]
[ y, z, x]

-z facing. z -> -z, x -> -x
[-x, y,-z]
[-y,-x,-z]
[ x,-y,-z]
[ y, x,-z]

-x facing -x -> z z -> x
[ z, y,-x]
[-y, z,-x]
[-z,-y,-x]
[ y,-z,-x]

-y facing y -> -z, z -> y
[ x, z,-y]
[-z, x,-y]
[-x,-z,-y]
[ z,-x,-y]
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform int pointerCount;
uniform vec3 pointers[10];
uniform vec2 resolution;

float maxDist = 20.0;
float intersectionDist = 0.001;
int maxStep = 1000;
vec3 focalPoint = vec3(0.0, 0.0, -4.0);
mat3 calculateRotationMatrix(vec3 angles){
mat3 rotationX; mat3 rotationY; mat3 rotationZ;
rotationX[0] = vec3(1.0, 0.0, 0.0);
rotationX[1] = vec3(0.0, cos(angles.x), sin(angles.x));
rotationX[2] = vec3(0.0, -sin(angles.x), cos(angles.x));
rotationY[0] = vec3(cos(angles.y), 0.0, -sin(angles.y));
rotationY[1] = vec3(0.0, 1.0, 0.0);
rotationY[2] = vec3(sin(angles.y), 0.0, cos(angles.y));
rotationZ[0] = vec3(cos(angles.z), sin(angles.z), 0.0);
rotationZ[1] = vec3(-sin(angles.z), cos(angles.z), 0.0);
rotationZ[2] = vec3(0.0, 0.0, 1.0);
return rotationZ*rotationY*rotationX;
}
float sdCappedCylinder( vec3 p, float h, float r ) {
vec2 d = abs(vec2(length(p.xz),p.y)) - vec2(r,h);
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float rayMarch(vec3 ro, vec3 rd, vec3 tr, vec3 rot){

rd = normalize(rd);
float dist = 0.0;
float l = 0.0;
for(int i = 0; i < maxStep; ++i){
l = sdCappedCylinder(calculateRotationMatrix(rot)*ro+tr, 0.75, 0.25);
ro += l*rd;
dist = length(ro);
if(l<intersectionDist) return dist;
if(dist>maxDist){ return 0.0;}
}

}
void main(void) {
vec2 uv = gl_FragCoord.xy/resolution*2.0-1.0;
uv.x *= resolution.x/resolution.y;
vec3 tr = vec3(0.5*sin(time*0.1), 0.5*cos(time*0.1), 0.5*cos(time*0.3+1.21));
float d = rayMarch(
vec3(uv, -2.0),
vec3(uv, -2.0)-focalPoint, tr,
vec3(sin(time+0.3), cos(time), sin(time)));

gl_FragColor = vec4(d, d, d,1.0);
}

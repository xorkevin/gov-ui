out=defs
rm -rf $out
mkdir -p $out

docker-compose -f dc.main.yaml -f dc.service.yaml config > $out/dc.nuke.yaml

----
For proper work
----

* Install link:https://docs.docker.com/get-docker/[Docker]
* Install flatbuffers 1.12


.MacOS
[source,bash]

brew install flatbuffers


.Linux
[source,bash]

# When using Ubuntu 20.10+, simply use
# sudo apt install -y flatbuffers-compiler
# otherwise,
wget https://launchpad.net/ubuntu/+source/flatbuffers/1.12.1~git20200711.33e2d80+dfsg1-0.3/+build/19612152/+files/libflatbuffers1_1.12.1~git20200711.33e2d80+dfsg1-0.3_amd64.deb
wget https://launchpad.net/ubuntu/+source/flatbuffers/1.12.1~git20200711.33e2d80+dfsg1-0.3/+build/19612152/+files/flatbuffers-compiler_1.12.1~git20200711.33e2d80+dfsg1-0.3_amd64.deb
dpkg -i libflatbuffers1_1.12.1~git20200711.33e2d80+dfsg1-0.3_amd64.deb
dpkg -i flatbuffers-compiler_1.12.1~git20200711.33e2d80+dfsg1-0.3_amd64.deb

----
.Windows
See https://community.chocolatey.org/packages/flatc


----
To build everything
----

./mvnw clean install in root

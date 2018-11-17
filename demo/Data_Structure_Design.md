## Data Structure Design

_Goal_: A strongly typed, cross language data structure, that can provide multiple developers a common interface between microservices, while also allowing the team to iterate on and change the data structure as required by project evolution.

### ProtoBuf

[Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview) - `a language-neutral, platform-neutral, extensible way of serializing structured data for use in communications protocols, data storage, and more.`

We have one primary data structure - the object describing a project.  This data structure will need to be created/operated on /deserialized by the frontend (in JavaScript), and the middleware/Lambda functions (in Python/Java/JS, at the developer's discretion) and stored into S3.

### Proposed protobuff message definition

```
syntax = "proto2";

package cs_se_project;

message SEProject {
	required string name = 1;
	required int32 year = 2;
	optional string semester = 3;
	
	message Instructor {
		required string last_name = 1;
		optional string first_name = 2;
		optional string email = 3;
	}
	
	optional Instructor instructor = 4;
	
	message Tag {
		required string key = 1;
		required string value = 2;
	}
	
	repeated Tag tag = 5;
		
}
```

#### Example in python:

* Create the `cs_se_project.proto` file describing the data structure

```
tglynn:protobuff_test$ cat cs_se_project.proto
syntax = "proto2";

package cs_se_project;

message SEProject {
	required string name = 1;
	required int32 year = 2;
	optional string semester = 3;

	message Instructor {
		required string last_name = 1;
		optional string first_name = 2;
		optional string email = 3;
	}

	optional Instructor instructor = 4;

	message Tag {
		required string key = 1;
		required string value = 2;
	}

	repeated Tag tag = 5;

}
```

* Download protoc compiler (use a prebuilt binary for your OS (ie `protoc-3.6.1-osx-x86_64.zip`)

```
tglynn:protobuff_test$ ls
cs_se_project.proto		protoc-3.6.1-osx-x86_64.zip
```

* Generate the supporting python code using the `protoc` utility

```
tglynn:protobuff_test$ ./protobuf/bin/protoc -I=$PWD --python_out=$PWD $PWD/cs_se_project.proto
tglynn:protobuff_test$ ls
cs_se_project.proto		protobuf
cs_se_project_pb2.py		protoc-3.6.1-osx-x86_64.zip
```

* Note that I needed to pip install 2 additional components (`google` and `protobuf`)

```
tglynn:protobuff_test$ pip install protobuf
Collecting protobuf
  Downloading https://files.pythonhosted.org/packages/c7/27/133f225035b9539f2dcfebcdf9a69ff0152f56e0120160ec5c972ea7deb9/protobuf-3.6.1-cp36-cp36m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64.whl (1.2MB)
    100% |████████████████████████████████| 1.2MB 7.2MB/s
Requirement already satisfied: setuptools in /Users/tglynn/.pyenv/versions/3.6.6/lib/python3.6/site-packages (from protobuf) (39.0.1)
Requirement already satisfied: six>=1.9 in /Users/tglynn/.pyenv/versions/3.6.6/lib/python3.6/site-packages (from protobuf) (1.11.0)
Installing collected packages: protobuf
Successfully installed protobuf-3.6.1
tglynn:protobuff_test$ pip install google
Collecting google
  Downloading https://files.pythonhosted.org/packages/c8/b1/887e715b39ea7d413a06565713c5ea0e3132156bd6fc2d8b165cee3e559c/google-2.0.1.tar.gz
Collecting beautifulsoup4 (from google)
  Downloading https://files.pythonhosted.org/packages/21/0a/47fdf541c97fd9b6a610cb5fd518175308a7cc60569962e776ac52420387/beautifulsoup4-4.6.3-py3-none-any.whl (90kB)
    100% |████████████████████████████████| 92kB 3.1MB/s
Installing collected packages: beautifulsoup4, google
  Running setup.py install for google ... done
Successfully installed beautifulsoup4-4.6.3 google-2.0.1
```

* Building a proto buff object:

```
Python 3.6.6 (default, Aug 30 2018, 19:34:12)
[GCC 4.2.1 Compatible Apple LLVM 9.1.0 (clang-902.0.39.2)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> from cs_se_project_pb2 import SEProject
>>> test_project = SEProject()
>>> test_project.name = "Water Fountain Map"
>>> test_project.year = 2016
>>> test_project.semester = "Fall"
>>> test_project.instructor.last_name = "Elentukh"
>>> test_project.instructor.first_name = "Alex"
>>> tag_1 = test_project.tag.add()
>>> tag_1.key = "language"
>>> tag_1.value = "python"
```

* Note that the data structure has limited fields:

```
>>> test_project.bogus_field = "Bogus!"
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: Assignment not allowed (no field "bogus_field" in protocol message object).
>>> test_project.year = "2018"
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: '2018' has type str, but expected one of: int, long
```

And can be checked for integrity and completeness

```
>>> test_project.IsInitialized()
True
>>> test_project.FindInitializationErrors()
[]
```


#### Example in Go

* Definition 

```
tglynn:golang$ cat cs_se_project.proto
syntax = "proto2";

package cs_se_project;

message SEProject {
	required string name = 1;
	required int32 year = 2;
	optional string semester = 3;

	message Instructor {
		required string last_name = 1;
		optional string first_name = 2;
		optional string email = 3;
	}

	optional Instructor instructor = 4;

	message Tag {
		required string key = 1;
		required string value = 2;
	}

	repeated Tag tag = 5;

}

```

* Get protobuf

```
tglynn:golang$ go get -u github.com/golang/protobuf/protoc-gen-go
```

* Generate code

```
tglynn:golang$ ../protobuf/bin/protoc -I=$PWD --go_out=$PWD $PWD/cs_se_project.proto
tglynn:golang$ ls
cs_se_project.pb.go	cs_se_project.proto
```

* Sample code

```
tglynn:golang$ cat test_pb.go
package main

import (
    pb "./cs_se_project"
)

func main() {
    name := "Water Fountain"
    var year int32 = 2016
    sem := "Fall"
    key := "Language"
    value := "Python"
    test_proj := pb.SEProject{
        Name: &name,
        Year: &year,
        Semester: &sem,
        Tag: []*pb.SEProject_Tag{
            {Key: &key, Value: &value},
        },
    }
}
```

Example in JS:

# TODO

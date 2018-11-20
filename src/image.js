class gltfImage
{
    constructor(uri = undefined, type = gl.TEXTURE_2D, miplevel = 0, bufferView = undefined, name = undefined, mimeType = "image/jpeg", image = undefined)
    {
        this.uri = uri;
        this.bufferView = bufferView;
        this.mimeType = mimeType;
        this.image = image; // javascript image
        this.name = name;
        this.type = type; // nonstandard
        this.miplevel = miplevel; // nonstandard
    }

    fromJson(jsonImage, path = "")
    {
        fromKeys(this, jsonImage);

        if(this.uri !== undefined)
        {
            this.uri = path + this.uri;
        }
    }

    load(gltf)
    {
        if (this.image !== undefined) // alread loaded
        {
            return;
        }

        let image = new Image();
        let uri = this.uri;
        let bufferView = this.bufferView;
        let mimeType = this.mimeType;

        let promise = new Promise(function(resolve, reject)
        {
            if (uri !== undefined) // load from uri
            {
                image.onload = resolve;
                image.onerror = resolve;
                image.src = uri;
            }
            else if (bufferView !== undefined) // load from binary
            {
                image.onload = resolve;
                image.onerror = resolve;

                let view = gltf.bufferViews[bufferView];
                let buffer = gltf.buffers[view.buffer].buffer;
                let array = new Uint8Array(buffer, view.byteOffset, view.byteLength);
                let blob = new Blob([array], { "type": mimeType });
                image.src = URL.createObjectURL(blob);
            }
        });

        this.image = image;
        return promise;
    }

    loadFromFiles(files)
    {
        if (this.image !== undefined)
        {
            return;
        }

        let bufferFile;
        for (bufferFile of files)
        {
            if (bufferFile.name === this.uri)
            {
                break;
            }
        }

        const image = new Image();
        const reader = new FileReader();
        const uri = this.uri;
        const promise = new Promise(function(resolve, reject)
        {
            image.onload = resolve;
            image.onerror = resolve;

            if (bufferFile.name !== uri)
            {
                image.src = uri;
            }
            else
            {
                reader.onloadend = function(event)
                {
                    image.src = event.target.result;
                };
                reader.readAsDataURL(bufferFile);
            }
        });

        this.image = image;
        return promise;
    }
};
